/* eslint-disable jsx-a11y/anchor-is-valid */
import { Formik, Form, Field } from "formik";
import { Helmet } from "react-helmet";
import { Input, Button, Col, Row } from "reactstrap";
import axios from "utils/axios";
import { FaUpload } from "react-icons/fa";
import { useEffect, useState } from "react";
import { ProductImagesSchema } from "validation";
import FormikSelect from "components/Select/FormikSelect";
import { addProductImageHandle } from "utils";

const ProductImages = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get(`/products?pageNo=1&pageSize=100`).then((res) => {
      setProducts((products) => (products = res.data?.products));
    });
  }, []);

  return (
    <>
      <Helmet>
        <title>Admin</title>
      </Helmet>

      <Row>
        <Col xs={12} md={10} lg={6} className="mx-auto">
          <div className="register-form">
            <div className="title">
              <h3>Ürün Detay Resmi Ekle</h3>
            </div>
            <Formik validationSchema={ProductImagesSchema} initialValues={{ productId: "", imageUrl: "", file: [] }} onSubmit={addProductImageHandle}>
              {({ isSubmitting, isValid, dirty, values, handleChange, errors, touched, setFieldValue }) => (
                <Form className="row">
                  <Col sm={6}>
                    <div className="form-group">
                      <label htmlFor="reg-pId">Ürün Adı</label>
                      <Field
                        component={FormikSelect}
                        id="reg-pId"
                        name="productId"
                        options={
                          Array.isArray(products)
                            ? products.map((product) => {
                                return { value: product.id, label: product.name };
                              })
                            : []
                        }
                      />
                      {errors.productId && touched.productId ? <small className="text-danger">{errors.productId}</small> : null}
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="form-group">
                      <label htmlFor="reg-url">Resim URL</label>
                      <Input className="form-control" name="imageUrl" value={values.imageUrl} onChange={handleChange} id="reg-url" />
                      {errors.imageUrl && touched.imageUrl ? <small className="text-danger">{errors.imageUrl}</small> : null}
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="form-group">
                      <label htmlFor="reg-file">Resim</label>
                      <label
                        className=" btn form-control text-center text-bg-primary d-flex align-items-center justify-content-center gap-2"
                        htmlFor="reg-file"
                      >
                        <FaUpload /> Resim Yükleyin
                      </label>
                      <Input
                        className="form-control d-none"
                        name="file"
                        type="file"
                        onChange={(e) => setFieldValue("file", e.target.files)}
                        id="reg-file"
                        multiple
                      />
                    </div>
                  </Col>
                  <div className="button">
                    <Button type="submit" disabled={!isValid || !dirty || isSubmitting}>
                      Ekle
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default ProductImages;
