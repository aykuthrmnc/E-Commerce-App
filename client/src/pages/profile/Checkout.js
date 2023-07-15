import { Form, Formik } from "formik";
import { useSelector } from "react-redux";
import { currencyFormatter } from "utils/currencyFormat";
import { CheckoutSchema } from "validation";
import { Button, Input } from "reactstrap";
import { clearCartHandle } from "utils";
import axios from "utils/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

const Checkout = () => {
  const user = useSelector((state) => state.auth.user);
  const carts = useSelector((state) => state.cart.carts);
  const navigate = useNavigate();

  const handleSubmit = (values, actions) => {
    axios
      .post("/order/deneme", values)
      .then((res) => {
        toast.success("İşleminiz başarıyla gerçekleşti.");
        clearCartHandle();
        navigate("/");
        // actions.resetForm();
      })
      .catch((err) => {
        toast.error(err.response.data.payment.errorMessage || "Bir hata oluştu");
      })
      .finally(() => {
        actions.setSubmitting(false);
      });
  };

  return (
    <>
      <Helmet>
        <title>Ödeme</title>
      </Helmet>
      <Formik
        validationSchema={CheckoutSchema}
        initialValues={{
          firstName: user?.firstName || "",
          lastName: user?.lastName || "",
          phoneNumber: user?.phoneNumber || "123456789",
          email: user?.email || "",
          addressLine1: "Adres kısmı",
          country: "Türkiye",
          city: "Konya",
          zipCode: "42000",
          description: "Açıklama kısmı",
          cardName: user?.firstName + " " + user?.lastName || "",
          cardNumber: "5528790000000008",
          cardMonth: "12",
          cardYear: "2030",
          cardCvc: "123",
        }}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values, handleChange, errors, touched }) => (
          <Form className="checkout-wrapper section">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-8">
                  <div className="checkout-steps-form-style-1">
                    <ul id="accordionExample">
                      <li>
                        <div
                          className="title"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseThree"
                          aria-expanded="true"
                          aria-controls="collapseThree"
                        >
                          Kişisel Bilgiler
                        </div>
                        <section
                          className="checkout-steps-form-content collapse show"
                          id="collapseThree"
                          aria-labelledby="headingThree"
                          data-bs-parent="#accordionExample"
                        >
                          <div className="row">
                            <div className="col-md-6">
                              <div className="single-form form-default">
                                <div className="form-input form">
                                  <label htmlFor="reg-fn">Ad</label>
                                  <Input
                                    className="form-control form-control-sm"
                                    name="firstName"
                                    value={values.firstName}
                                    onChange={handleChange}
                                    id="reg-fn"
                                    placeholder="Ad"
                                  />
                                  {errors.firstName && touched.firstName ? <small className="text-danger">{errors.firstName}</small> : null}
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="single-form form-default">
                                <div className="form-input form">
                                  <label htmlFor="reg-ln">Soyad</label>
                                  <Input
                                    className="form-control form-control-sm"
                                    name="lastName"
                                    value={values.lastName}
                                    onChange={handleChange}
                                    id="reg-ln"
                                    placeholder="Soyad"
                                  />
                                  {errors.lastName && touched.lastName ? <small className="text-danger">{errors.lastName}</small> : null}
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="single-form form-default">
                                <div className="form-input form">
                                  <label htmlFor="reg-email">E-posta</label>
                                  <Input
                                    className="form-control form-control-sm"
                                    name="email"
                                    value={values.email}
                                    onChange={handleChange}
                                    id="reg-email"
                                    placeholder="E-posta"
                                  />
                                  {errors.email && touched.email ? <small className="text-danger">{errors.email}</small> : null}
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="single-form form-default">
                                <div className="form-input form">
                                  <label htmlFor="reg-tel">Telefon Numarası</label>
                                  <Input
                                    className="form-control form-control-sm"
                                    name="phoneNumber"
                                    value={values.phoneNumber}
                                    onChange={handleChange}
                                    id="reg-tel"
                                    placeholder="Telefon Numarası"
                                  />
                                  {errors.phoneNumber && touched.phoneNumber ? <small className="text-danger">{errors.phoneNumber}</small> : null}
                                </div>
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="single-form button">
                                <button
                                  type="button"
                                  className="btn"
                                  data-bs-toggle="collapse"
                                  data-bs-target="#collapseFour"
                                  aria-expanded="false"
                                  aria-controls="collapseFour"
                                >
                                  Sonraki Aşama
                                </button>
                              </div>
                            </div>
                          </div>
                        </section>
                      </li>
                      <li>
                        <div
                          className="title collapsed"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseFour"
                          aria-expanded="false"
                          aria-controls="collapseFour"
                        >
                          Teslimat Adresi
                        </div>
                        <section
                          className="checkout-steps-form-content collapse"
                          id="collapseFour"
                          aria-labelledby="headingFour"
                          data-bs-parent="#accordionExample"
                        >
                          <div className="row">
                            <div className="col-md-6">
                              <div className="single-form form-default">
                                <div className="form-input form">
                                  <label htmlFor="reg-cn">Ülke</label>
                                  <Input
                                    className="form-control form-control-sm"
                                    name="country"
                                    value={values.country}
                                    onChange={handleChange}
                                    id="reg-cn"
                                    placeholder="Ülke"
                                  />
                                  {errors.country && touched.country ? <small className="text-danger">{errors.country}</small> : null}
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="single-form form-default">
                                <div className="form-input form">
                                  <label htmlFor="reg-ct">Şehir</label>
                                  <Input
                                    className="form-control form-control-sm"
                                    name="city"
                                    value={values.city}
                                    onChange={handleChange}
                                    id="reg-ct"
                                    placeholder="Şehir"
                                  />
                                  {errors.city && touched.city ? <small className="text-danger">{errors.city}</small> : null}
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="single-form form-default">
                                <div className="form-input form">
                                  <label htmlFor="reg-zc">Posta Kodu</label>
                                  <Input
                                    className="form-control form-control-sm"
                                    name="zipCode"
                                    value={values.zipCode}
                                    onChange={handleChange}
                                    id="reg-zc"
                                    placeholder="Posta Kodu"
                                  />
                                  {errors.zipCode && touched.zipCode ? <small className="text-danger">{errors.zipCode}</small> : null}
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="single-form form-default">
                                <div className="form-input form">
                                  <label htmlFor="reg-al1">Tam Adres</label>
                                  <Input
                                    className="form-control form-control-sm"
                                    name="addressLine1"
                                    value={values.addressLine1}
                                    onChange={handleChange}
                                    id="reg-al1"
                                    placeholder="Tam Adres"
                                  />
                                  {errors.addressLine1 && touched.addressLine1 ? <small className="text-danger">{errors.addressLine1}</small> : null}
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="single-form form-default">
                                <div className="form-input form">
                                  <label htmlFor="reg-zc">Açıklama</label>
                                  <Input
                                    className="form-control form-control-sm"
                                    name="description"
                                    value={values.description}
                                    onChange={handleChange}
                                    id="reg-zc"
                                    placeholder="Açıklama"
                                  />
                                  {errors.description && touched.description ? <small className="text-danger">{errors.description}</small> : null}
                                </div>
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="single-checkbox checkbox-style-3">
                                <input type="checkbox" id="checkbox-3" />
                                <label htmlFor="checkbox-3">
                                  <span />
                                </label>
                                <p>Teslimat ve posta adreslerim aynı olsun.</p>
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="steps-form-btn button">
                                <button
                                  type="button"
                                  className="btn"
                                  data-bs-toggle="collapse"
                                  data-bs-target="#collapseThree"
                                  aria-expanded="false"
                                  aria-controls="collapseThree"
                                >
                                  Önceki Aşama
                                </button>
                                <button
                                  type="button"
                                  className="btn"
                                  data-bs-toggle="collapse"
                                  data-bs-target="#collapsefive"
                                  aria-expanded="false"
                                  aria-controls="collapsefive"
                                >
                                  Sonraki Aşama
                                </button>
                                <a href=" #" className="btn btn-alt" data-bs-toggle="collapse" data-bs-target="#collapseFour">
                                  Kaydet &amp; Devam Et
                                </a>
                              </div>
                            </div>
                          </div>
                        </section>
                      </li>
                      <li>
                        <div
                          className="title collapsed"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapsefive"
                          aria-expanded="false"
                          aria-controls="collapsefive"
                        >
                          Ödeme Bilgileri
                        </div>
                        <section
                          className="checkout-steps-form-content collapse"
                          id="collapsefive"
                          aria-labelledby="headingFive"
                          data-bs-parent="#accordionExample"
                        >
                          <div className="row">
                            <div className="col-12">
                              <div className="checkout-payment-form">
                                <div className="single-form form-default">
                                  <label htmlFor="credit-name">Kart Sahibinin Adı</label>
                                  <div className="form-input form">
                                    <Input
                                      className="form-control form-control-sm"
                                      name="cardName"
                                      value={values.cardName}
                                      onChange={handleChange}
                                      id="credit-name"
                                      placeholder="Kart Sahibinin Adı"
                                    />
                                    {errors.cardName && touched.cardName ? <small className="text-danger">{errors.cardName}</small> : null}
                                    {/* <input type="text" placeholder="Kart Sahibinin Adı" /> */}
                                  </div>
                                </div>
                                <div className="single-form form-default">
                                  <label htmlFor="credit-number">Kart Numarası</label>
                                  <div className="form-input form">
                                    <Input
                                      className="form-control form-control-sm"
                                      name="cardNumber"
                                      value={values.cardNumber}
                                      onChange={handleChange}
                                      id="credit-number"
                                      placeholder="0000 0000 0000 0000"
                                    />
                                    {errors.cardNumber && touched.cardNumber ? <small className="text-danger">{errors.cardNumber}</small> : null}

                                    <img
                                      src="/images/payment/card.png"
                                      alt="card"
                                      onError={({ currentTarget }) => {
                                        currentTarget.onerror = null; // prevents looping
                                        currentTarget.src = process.env.REACT_APP_DEFAULT_IMAGE;
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="payment-card-info d-flex flex-wrap">
                                  <div className="single-form form-default mm-yy">
                                    <label htmlFor="credit-month">Son Kullanma Tarihi</label>
                                    <div className="expiration d-flex">
                                      <div className="form-input form">
                                        <Input
                                          className="form-control form-control-sm"
                                          name="cardMonth"
                                          value={values.cardMonth}
                                          onChange={handleChange}
                                          id="credit-month"
                                          placeholder="MM"
                                        />
                                      </div>
                                      <div className="form-input form">
                                        <Input
                                          className="form-control form-control-sm"
                                          name="cardYear"
                                          value={values.cardYear}
                                          onChange={handleChange}
                                          id="credit-year"
                                          placeholder="YYYY"
                                        />
                                      </div>
                                    </div>
                                    {(errors.cardMonth && touched.cardMonth) || (errors.cardYear && touched.cardYear) ? (
                                      <small className="text-danger">{errors.cardMonth || errors.cardYear}</small>
                                    ) : null}
                                  </div>
                                  <div className="single-form form-default">
                                    <label htmlFor="credit-cvc">
                                      CVC/CVV{" "}
                                      <span>
                                        <i className="mdi mdi-alert-circle" />
                                      </span>
                                    </label>
                                    <div className="form-input form">
                                      <Input
                                        className="form-control form-control-sm"
                                        name="cardCvc"
                                        value={values.cardCvc}
                                        onChange={handleChange}
                                        id="credit-cvc"
                                        placeholder="***"
                                      />
                                      {errors.cardCvc && touched.cardCvc ? <small className="text-danger">{errors.cardCvc}</small> : null}
                                    </div>
                                  </div>
                                </div>
                                <div className="single-form form-default button">
                                  <button
                                    type="button"
                                    className="btn"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#collapseFour"
                                    aria-expanded="false"
                                    aria-controls="collapseFour"
                                  >
                                    Önceki Aşama
                                  </button>
                                  <button type="button" className="btn" data-bs-toggle="collapse" data-bs-target="#collapsefive">
                                    Kaydet &amp; Devam Et
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </section>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="checkout-sidebar">
                    <div className="checkout-sidebar-price-table">
                      <h5 className="title">Toplam Tutar</h5>
                      <div className="sub-total-price">
                        <div className="total-price">
                          <p className="value">Ürün Toplam Fiyatı:</p>
                          <p className="price">{currencyFormatter.format(carts?.reduce((i, j) => i + j.price * j.quantity, 0))}</p>
                        </div>
                        <div className="total-price shipping">
                          <p className="value">İndirim:</p>
                          <p className="price">{currencyFormatter.format(carts?.reduce((i, j) => i + j.discount, 0))}</p>
                        </div>
                        <div className="total-price discount">
                          <p className="value">Kargo:</p>
                          <p className="price">{currencyFormatter.format(0)}</p>
                        </div>
                      </div>
                      <div className="total-payable">
                        <div className="payable-price">
                          <p className="value">Toplam:</p>
                          <p className="price">
                            {currencyFormatter.format(carts?.reduce((i, j) => i + (j.price + j.discount / 100) * j.quantity, 0))}
                          </p>
                        </div>
                      </div>
                      <div className="price-table-btn button">
                        <Button type="submit" className="btn btn-alt" disabled={isSubmitting || carts?.length <= 0}>
                          Siparişi Onayla
                        </Button>
                        {carts?.length <= 0 && <small className="d-block text-danger">Sepetinizde ürün olmadan sipariş veremezsiniz.</small>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default Checkout;
