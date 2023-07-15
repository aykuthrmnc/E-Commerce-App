import { Form, Field, useFormik, FormikProvider } from "formik";
import { Helmet } from "react-helmet";
import { Input, Button, Col, Row } from "reactstrap";
import { ProductImagesSchema, ProductSchema } from "validation";
import axios from "utils/axios";
import { useEffect, useState } from "react";
import FormikSelect from "components/Select/FormikSelect";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import FilePondUpload from "components/FileUpload/FilePond";

const Product = () => {
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState(null);
  const params = useParams();
  const navigate = useNavigate();

  const getProductHandle = () => {
    axios.get(`/products/${params?.id}`).then((res) => {
      setProduct(res.data);
    });
  };

  const addProductImageHandle = (values, actions) => {
    const formData = new FormData();
    for (const value in values) {
      if (Array.isArray(values[value])) {
        for (const val of values[value]) {
          formData.append(value, val);
        }
      } else {
        formData.append(value, values[value]);
      }
    }

    // for (const [key, value] of Object.entries(values)) {
    //   if (Array.isArray(value)) {
    //     for (const val of value) {
    //       formData.append(key, val);
    //     }
    //   } else {
    //     formData.append(key, value);
    //   }
    // }

    axios
      .post("/products/multipleimages", formData)
      .then((res) => {
        toast.success("Ürün detay resimleri başarıyla eklendi.");
        formikImage.setValues({
          ...formikImage.values,
          imageUrl: "",
          file: [],
        });
        formikImage.setTouched(false);
        getProductHandle();
      })
      .catch((err) => {
        toast.error(err.response.data);
      })
      .finally(() => {
        actions.setSubmitting(false);
      });
  };

  const removeProductImageHandle = (product) => {
    axios
      .delete(`/products/multipleimages/${product.id}`)
      .then(() => {
        toast.success("Ürün resmi başarıyla silindi.");
        getProductHandle();
      })
      .catch(() => {
        toast.error("Ürün resmi silinemedi.");
      });
  };

  useEffect(() => {
    axios.get("/categories").then((res) => {
      setCategories(res.data);
    });
  }, []);

  useEffect(() => {
    if (params?.id) {
      axios.get(`/products/${params?.id}`).then((res) => {
        setProduct(res.data);
        formik.setValues({
          id: res.data.id,
          categoryId: res.data.categoryId,
          name: res.data.name,
          url: res.data.url,
          price: res.data.price,
          quantity: res.data.quantity,
          description: res.data.description ?? "",
          imageUrl: (res.data.imageUrl ?? "").split("/", 4).pop().split(".").shift(),
        });
        formikImage.setValues({
          productId: res.data.id,
          imageUrl: "",
          file: [],
        });
        // setCategories((categories) => (categories = res.data));
      });
    }
  }, [params?.id]);

  const addOrUpdateProductHandle = (values, actions) => {
    const formData = new FormData();
    for (const value in values) {
      formData.append(value, values[value]);
    }

    if (values.id) {
      axios
        .put("/products", formData)
        .then((res) => {
          toast.success("Ürün Başarıyla Güncellendi.");
        })
        .catch((err) => {
          toast.error(err.response.data);
        })
        .finally(() => {
          actions.setSubmitting(false);
        });
    } else {
      axios
        .post("/products", formData)
        .then((res) => {
          navigate(`/admin/product/${res.data.id}`, {
            replace: true,
          });
          toast.success("Ürün Başarıyla Eklendi");
          // actions.resetForm();
        })
        .catch((err) => {
          toast.error(err.response.data);
        })
        .finally(() => {
          actions.setSubmitting(false);
        });
    }
  };

  // const categoriesMap = () => {
  //   return categories?.map((category) => (
  //     <Fragment>
  //       <option key={category.id} value={category.id}>
  //         {category.name}
  //       </option>
  //       {categoriesMap(category?.subCategories)}
  //     </Fragment>
  //   ));
  // };

  const formik = useFormik({
    initialValues: { categoryId: "", name: "", url: "", price: "", quantity: "", description: "", imageUrl: "", file: "" },
    validationSchema: ProductSchema,
    onSubmit: addOrUpdateProductHandle,
  });

  const formikImage = useFormik({
    initialValues: { productId: "", imageUrl: "", file: [] },
    validationSchema: ProductImagesSchema,
    onSubmit: addProductImageHandle,
  });

  const listCategories = (categories) => {
    if (Array.isArray(categories)) {
      const categoriesArray = [];
      categories.forEach((category) => {
        categoriesArray.push({ value: category.id, label: category.name });
        if (category.subCategories) {
          category.subCategories.forEach((subCategory) => {
            categoriesArray.push({ value: subCategory.id, label: subCategory.name });
          });
        }
      });
      return categoriesArray;
    }
    return [];
  };

  return (
    <>
      <Helmet>
        <title>{product?.name || "Admin • Ürün"}</title>
      </Helmet>

      <Row className="g-3">
        {product && (
          <div className="d-flex justify-content-center justify-content-md-end">
            <Button color="primary" tag={Link} to={`/${product?.id}`}>
              Ürün Sayfasına Git
            </Button>
          </div>
        )}
        <Col xs={12} md={10} lg={6} className="mx-auto">
          <div className="register-form">
            <div className="title">
              <h3>{params?.id ? "Ürün Güncelle" : "Ürün Ekle"}</h3>
            </div>
            <FormikProvider value={formik}>
              <Form className="row">
                <Col sm={6}>
                  <div className="form-group">
                    <label htmlFor="reg-mId">Kategori</label>
                    <Field component={FormikSelect} id="reg-mId" name="categoryId" options={listCategories(categories)} />
                    {formik.errors.categoryId && formik.touched.categoryId ? <small className="text-danger">{formik.errors.categoryId}</small> : null}
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="form-group">
                    <label htmlFor="reg-n">Ürün Adı</label>
                    <Input className="form-control" name="name" value={formik.values.name} onChange={formik.handleChange} id="reg-n" />
                    {formik.errors.name && formik.touched.name ? <small className="text-danger">{formik.errors.name}</small> : null}
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="form-group">
                    <label htmlFor="reg-url">Ürün URL</label>
                    <Input className="form-control" name="url" value={formik.values.url} onChange={formik.handleChange} id="reg-url" />
                    {formik.errors.url && formik.touched.url ? <small className="text-danger">{formik.errors.url}</small> : null}
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="form-group">
                    <label htmlFor="reg-price">Fiyat</label>
                    <Input className="form-control" name="price" value={formik.values.price} onChange={formik.handleChange} id="reg-price" />
                    {formik.errors.price && formik.touched.price ? <small className="text-danger">{formik.errors.price}</small> : null}
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="form-group">
                    <label htmlFor="reg-qty">Adet</label>
                    <Input className="form-control" name="quantity" value={formik.values.quantity} onChange={formik.handleChange} id="reg-qty" />
                    {formik.errors.quantity && formik.touched.quantity ? <small className="text-danger">{formik.errors.quantity}</small> : null}
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="form-group">
                    <label htmlFor="reg-dsc">Açıklama</label>
                    <Input
                      className="form-control"
                      name="description"
                      value={formik.values.description}
                      onChange={formik.handleChange}
                      id="reg-dsc"
                    />
                    {formik.errors.description && formik.touched.description ? (
                      <small className="text-danger">{formik.errors.description}</small>
                    ) : null}
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="form-group">
                    <label htmlFor="reg-img">Resim Url</label>
                    <Input className="form-control" name="imageUrl" value={formik.values.imageUrl} onChange={formik.handleChange} id="reg-img" />
                    {formik.errors.imageUrl && formik.touched.imageUrl ? <small className="text-danger">{formik.errors.imageUrl}</small> : null}
                  </div>
                </Col>
                {/* <Col sm={6}>
                  <div className="form-group">
                    <label htmlFor="reg-file">Resim</label>
                    <Dropzone
                      multiple={false}
                      accept={{ "image/png": [".png"], "image/jpeg": [".jpg", ".jpeg"] }}
                      onDropAccepted={(acceptedFiles) => {
                        formik.setFieldValue("file", acceptedFiles[0]);
                        toast.success("Resim eklendi.");
                      }}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <div {...getRootProps()}>
                          <input {...getInputProps()} id="reg-file" name="file" />
                          <label className=" btn form-control text-center text-bg-primary d-flex align-items-center justify-content-center gap-2">
                            <FaUpload /> Resim Yükleyin
                          </label>
                        </div>
                      )}
                    </Dropzone>
                  </div>
                </Col> */}
                <Col sm="6">
                  <FilePondUpload
                    id="reg-file"
                    name="file"
                    file={formik.values.file}
                    setFile={(value) => formik.setFieldValue("file", value || "")}
                  />
                  {/* <Field component={FilePondUpload} id="reg-file" name="file" /> */}
                </Col>
                {/* <Col sm={6}>
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
                      onChange={(e) => formik.setFieldValue("file", e.target.files[0])}
                      id="reg-file"
                    />

                    <StyledDropzone
                      id="reg-file"
                      name="file"
                      onDropAccepted={(acceptedFiles) => {
                        formik.setFieldValue("file", acceptedFiles[0]);
                        toast.success("Resim eklendi.");
                      }}
                    />
                    
                    <PreviewDropzone
                      id="reg-file"
                      name="file"
                      onDropAccepted={(acceptedFiles) => {
                        formik.setFieldValue("file", acceptedFiles);
                        toast.success("Resim eklendi.");
                      }}
                    />
                  </div>
                </Col> */}
                <div className="button">
                  <Button type="submit" disabled={!formik.dirty || formik.isSubmitting}>
                    {params?.id ? "Güncelle" : "Ekle"}
                  </Button>
                </div>
              </Form>
            </FormikProvider>
          </div>
        </Col>

        {product && (
          <Col xs={12} md={10} lg={6} className="mx-auto mx-lg-0">
            <div className="register-form">
              <div className="title">
                <h3>Ürün Detay Resmi Ekle</h3>
              </div>
              <FormikProvider value={formikImage}>
                <Form className="row">
                  <Col sm={6}>
                    <div className="form-group">
                      <label htmlFor="reg-murl">Resim URL</label>
                      <Input
                        className="form-control"
                        name="imageUrl"
                        value={formikImage.values.imageUrl}
                        onChange={formikImage.handleChange}
                        id="reg-murl"
                      />
                      {formikImage.errors.imageUrl && formikImage.touched.imageUrl ? (
                        <small className="text-danger">{formikImage.errors.imageUrl}</small>
                      ) : null}
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="form-group">
                      <label htmlFor="reg-mfile">Resim</label>
                      <FilePondUpload
                        id="reg-mfile"
                        name="file"
                        file={formikImage.values.file}
                        setFile={(value) => formikImage.setFieldValue("file", value || "")}
                        isMultiple
                      />
                      {/* <Dropzone
                        accept={{ "image/png": [".png"], "image/jpeg": [".jpg", ".jpeg"] }}
                        onDropAccepted={(acceptedFiles) => {
                          formikImage.setFieldValue("file", acceptedFiles);
                          toast.success("Resimler eklendi.");
                        }}
                      >
                        {({ getRootProps, getInputProps }) => (
                          <div {...getRootProps()}>
                            <input {...getInputProps()} id="reg-mfile" name="file" />
                            <label className=" btn form-control text-center text-bg-primary d-flex align-items-center justify-content-center gap-2">
                              <FaUpload /> Resim Yükleyin
                            </label>
                          </div>
                        )}
                      </Dropzone> */}
                    </div>
                  </Col>
                  <div className="button">
                    <Button type="submit" disabled={!formikImage.dirty || formikImage.isSubmitting}>
                      Ekle
                    </Button>
                  </div>
                </Form>
              </FormikProvider>
            </div>
          </Col>
        )}
        {product?.productImages?.length > 0 && (
          <Col xs={12} className="mx-auto">
            <div className="cart-list-head">
              <div className="cart-list-title">
                <Row>
                  <Col xs="12" md="9">
                    <p>Ürün Resmi</p>
                  </Col>
                  <Col className="text-center">
                    <p>Sil</p>
                  </Col>
                </Row>
              </div>
              {product?.productImages?.map((product) => (
                <div key={product.id} className="cart-single-list p-3">
                  <Row className="align-items-center">
                    <Col xs="12" md="9">
                      <img
                        src={product.imageUrl ? `${process.env.REACT_APP_BASE_URL}/${product.imageUrl}` : process.env.REACT_APP_DEFAULT_IMAGE}
                        alt={product.name}
                        style={{ maxHeight: "50px" }}
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null; // prevents looping
                          currentTarget.src = process.env.REACT_APP_DEFAULT_IMAGE;
                        }}
                      />
                    </Col>
                    <Col className="text-center">
                      <Button color="danger" onClick={() => removeProductImageHandle(product)}>
                        Sil
                      </Button>
                    </Col>
                  </Row>
                </div>
              ))}
            </div>
          </Col>
        )}
      </Row>
    </>
  );
};

export default Product;
