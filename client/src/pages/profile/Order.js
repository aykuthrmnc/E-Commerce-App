import { currencyFormatter } from "utils/currencyFormat";
import { Button, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchOrders } from "utils/fetchers";
import axios from "utils/axios";
import { FaStar } from "react-icons/fa";
import { Field, Form, FormikProvider, useFormik } from "formik";
import { RatingSchema } from "validation";
import { toast } from "react-toastify";
import { useState } from "react";
import classNames from "classnames";
import { Helmet } from "react-helmet";

const Order = () => {
  const { data: orders } = useQuery(["orders"], fetchOrders);

  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  const getInvoice = (id) => {
    axios
      .get(`/order/invoice/${id}`, { responseType: "blob" })
      .then((res) => {
        const href = URL.createObjectURL(res.data);
        // create "a" HTML element with href to file & click
        const link = document.createElement("a");
        link.href = href;
        link.setAttribute("download", "fatura.pdf"); //or any other extension
        document.body.appendChild(link);
        link.click();
        // clean up "a" element & remove ObjectURL
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addOrUpdateRatingHandle = (values, actions) => {
    axios
      .put("/productrating", values)
      .then(() => {
        toast.success("İşleminiz başarıyla gerçekleşti.");
        actions.resetForm();
        toggle();
      })
      .catch(() => {
        toast.error("İşleminiz gerçekleştirilemedi.");
      })
      .finally(() => {
        actions.resetForm(false);
      });
  };

  const getRatingHandle = (order, orderItem) => {
    formik.resetForm();
    axios
      .get(`/productrating?productId=${orderItem.productId}&orderId=${order.id}`)
      .then((res) => {
        formik.setValues({
          productId: orderItem?.productId,
          orderId: order?.id,
          description: res.data?.description ?? "",
          rating: res.data?.rating ?? "",
        });
      })
      .catch(() => {
        formik.setValues({
          productId: orderItem.productId,
          orderId: order.id,
          description: "",
          rating: "",
        });
      });

    setModal(true);
  };

  const formik = useFormik({
    initialValues: { productId: "", orderId: "", description: "", rating: "" },
    validationSchema: RatingSchema,
    onSubmit: addOrUpdateRatingHandle,
  });

  return (
    <>
      <Helmet>
        <title>Siparişler</title>
      </Helmet>
      <div className="checkout-wrapper section">
        <div className="container">
          <Row className="justify-content-center">
            <Col lg="12">
              <div className="checkout-steps-form-style-1">
                <ul id="accordionExample">
                  {orders?.length ? (
                    orders?.map((order) => (
                      <li key={order.id}>
                        <div className="title collapsed orderCollapse" data-bs-toggle="collapse" data-bs-target={`#collapse${order.id}`}>
                          <div className="d-flex flex-column flex-lg-row justify-content-between">
                            <span>
                              {order?.orderItems.slice(0, 3).map((orderItem) => (
                                <img
                                  key={orderItem.id}
                                  className="rounded-circle border border-2"
                                  src={
                                    orderItem.imageUrl
                                      ? `${process.env.REACT_APP_BASE_URL}/${orderItem.imageUrl}`
                                      : process.env.REACT_APP_DEFAULT_IMAGE
                                  }
                                  alt={orderItem.url}
                                  onError={({ currentTarget }) => {
                                    currentTarget.onerror = null; // prevents looping
                                    currentTarget.src = process.env.REACT_APP_DEFAULT_IMAGE;
                                  }}
                                />
                              ))}
                            </span>
                            <span>{`Sipariş No:${order.id} / ${new Date(order.createdAt).toLocaleDateString()}`}</span>
                            <span className="ms-auto me-3">
                              {currencyFormatter.format(order?.orderItems.reduce((a, b) => a + b.price * b.quantity, 0))}
                            </span>
                          </div>
                        </div>
                        <section className="checkout-steps-form-content collapse" id={`collapse${order.id}`} data-bs-parent="#accordionExample">
                          <Row xs="2" className="mt-3">
                            <Col className="d-flex flex-column gap-3">
                              {order?.orderItems.map((orderItem) => (
                                <div key={orderItem.id} className="d-flex gap-4 h-100">
                                  <img
                                    className="rounded"
                                    src={
                                      orderItem.imageUrl
                                        ? `${process.env.REACT_APP_BASE_URL}/${orderItem.imageUrl}`
                                        : process.env.REACT_APP_DEFAULT_IMAGE
                                    }
                                    alt={orderItem.url}
                                    style={{ height: "200px", width: "200px", objectFit: "cover" }}
                                    onError={({ currentTarget }) => {
                                      currentTarget.onerror = null; // prevents looping
                                      currentTarget.src = process.env.REACT_APP_DEFAULT_IMAGE;
                                    }}
                                  />
                                  <div className="d-flex flex-column gap-3">
                                    <Link to={`/${orderItem.productId}`} className="fs-5">
                                      {orderItem.name}
                                    </Link>
                                    <div>Adet: {orderItem.quantity}</div>
                                    <div>Fiyat: {currencyFormatter.format(orderItem.price)}</div>
                                    <div>Toplam: {currencyFormatter.format(orderItem.price * orderItem.quantity)}</div>
                                    <div className="mt-auto">
                                      <Button onClick={() => getRatingHandle(order, orderItem)} color="orange" className="text-white" type="button">
                                        Değerlendir
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </Col>
                            <Col className="d-flex flex-column gap-3">
                              <div className="fs-5 text-black">Sipariş Bilgileri</div>
                              <div>
                                Sipariş Numarası: <b>{order.id}</b>
                              </div>
                              <div>
                                Sipariş Tarihi: <b>{new Date(order.createdAt).toLocaleDateString()}</b>
                              </div>
                              <div>
                                Alıcı: <b>{`${order.firstName} ${order.lastName}`}</b>
                              </div>
                              <div>
                                Toplam: <b>{currencyFormatter.format(order?.orderItems.reduce((a, b) => a + b.price * b.quantity, 0))}</b>
                              </div>
                              <div className="d-flex gap-2">
                                <Button color="danger" onClick={() => getInvoice(order.id)}>
                                  Fatura Talep Et
                                </Button>
                              </div>
                            </Col>
                          </Row>
                        </section>
                      </li>
                    ))
                  ) : (
                    <div className="cart-single-list text-center">Siparişiniz bulunmamaktadır.</div>
                  )}
                </ul>
              </div>
            </Col>
          </Row>
        </div>

        <FormikProvider value={formik}>
          <Form id="form">
            <Modal isOpen={modal} toggle={toggle} cssModule={{ modal: "modal review-modal" }}>
              <ModalHeader toggle={toggle}>Ürünü Değerlendir</ModalHeader>
              <ModalBody>
                <div className="row">
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label htmlFor="review-rating">Puan</label>
                      <div className="star-container d-flex">
                        <label htmlFor="rating1">
                          <Field type="radio" id="rating1" name="rating" className="d-none" value="1" checked={+formik.values.rating === 1} />
                          <FaStar title="1 yıldız" size="24" />
                        </label>
                        <label htmlFor="rating2">
                          <Field type="radio" id="rating2" name="rating" className="d-none" value="2" checked={+formik.values.rating === 2} />
                          <FaStar title="2 yıldız" size="24" />
                        </label>
                        <label htmlFor="rating3">
                          <Field type="radio" id="rating3" name="rating" className="d-none" value="3" checked={+formik.values.rating === 3} />
                          <FaStar title="3 yıldız" size="24" />
                        </label>
                        <label htmlFor="rating4">
                          <Field type="radio" id="rating4" name="rating" className="d-none" value="4" checked={+formik.values.rating === 4} />
                          <FaStar title="4 yıldız" size="24" />
                        </label>
                        <label htmlFor="rating5">
                          <Field type="radio" id="rating5" name="rating" className="d-none" value="5" checked={+formik.values.rating === 5} />
                          <FaStar title="5 yıldız" size="24" />
                        </label>
                      </div>
                      {formik.errors.rating && formik.touched.rating ? <small className="text-danger">{formik.errors.rating}</small> : null}
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="review-message">Açıklama</label>
                  <textarea
                    className="form-control shadow-none"
                    id="description"
                    name="description"
                    rows={8}
                    required
                    value={formik.values.description}
                    onChange={formik.handleChange}
                  />
                  <div className="d-flex">
                    {formik.errors.description && formik.touched.description ? (
                      <small className="text-danger">{formik.errors.description}</small>
                    ) : null}
                    <small
                      className={classNames({
                        "ms-auto rating-description": true,
                        "text-danger": formik.values.description?.length > 255,
                      })}
                    >
                      {formik.values.description?.length ?? 0}/255
                    </small>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" type="submit" form="form" disabled={formik.isSubmitting}>
                  Onayla
                </Button>
              </ModalFooter>
            </Modal>
          </Form>
        </FormikProvider>
      </div>
    </>
  );
};

export default Order;
