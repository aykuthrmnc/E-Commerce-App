import { Form, Field, useFormik, FormikProvider } from "formik";
import { Helmet } from "react-helmet";
import { Input, Button, Col, Row } from "reactstrap";
import { CategorySchema } from "validation";
import axios from "utils/axios";
import { useEffect, useState } from "react";
import { getCategoriesHandle } from "utils";
import FormikSelect from "components/Select/FormikSelect";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/categories").then((res) => {
      setCategories((categories) => (categories = res.data));
    });
  }, []);

  useEffect(() => {
    if (params?.id) {
      axios.get(`/categories/${params?.id}`).then((res) => {
        formik.setValues({
          id: res.data.id,
          name: res.data.name,
          url: res.data.url,
          description: res.data.description,
          mainCategoryId: res.data.mainCategoryId,
        });
        // setCategories((categories) => (categories = res.data));
      });
    }
  }, [params?.id]);

  const addOrUpdateCategoryHandle = (values, actions) => {
    if (values.id) {
      axios
        .put(`/categories`, { ...values, mainCategoryId: values.mainCategoryId === "" ? 0 : values.mainCategoryId })
        .then((res) => {
          toast.success("Kategori başarıyla güncellendi.");
          getCategoriesHandle();
        })
        .catch((err) => {
          toast.error(err.response.data);
        })
        .finally(() => {
          actions.setSubmitting(false);
        });
    } else {
      axios
        .post("/categories", { ...values, mainCategoryId: values.mainCategoryId === "" ? 0 : values.mainCategoryId })
        .then((res) => {
          navigate(`/admin/category/${res.data.id}`, {
            replace: true,
          });
          toast.success("Kategori başarıyla eklendi");
          // actions.resetForm();
          // getCategoriesHandle();
        })
        .catch((err) => {
          toast.error(err.response.data);
        })
        .finally(() => {
          actions.setSubmitting(false);
        });
    }
  };

  const formik = useFormik({
    initialValues: { name: "", url: "", description: "", mainCategoryId: "" },
    validationSchema: CategorySchema,
    onSubmit: addOrUpdateCategoryHandle,
  });

  return (
    <>
      <Helmet>
        <title>Admin • Kategori</title>
      </Helmet>

      <Row>
        <Col xs={12} md={10} lg={6} className="mx-auto">
          <div className="register-form">
            <div className="title">
              <h3>{params?.id ? "Kategori Güncelle" : "Kategori Ekle"}</h3>
            </div>
            <FormikProvider value={formik}>
              <Form className="row">
                <Col sm={6}>
                  <div className="form-group">
                    <label htmlFor="reg-n">Kategori Adı</label>
                    <Input className="form-control" name="name" value={formik.values.name} onChange={formik.handleChange} id="reg-n" />
                    {formik.errors.name && formik.touched.name ? <small className="text-danger">{formik.errors.name}</small> : null}
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="form-group">
                    <label htmlFor="reg-url">Kategori URL</label>
                    <Input className="form-control" name="url" value={formik.values.url} onChange={formik.handleChange} id="reg-url" />
                    {formik.errors.url && formik.touched.url ? <small className="text-danger">{formik.errors.url}</small> : null}
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
                    <label htmlFor="reg-mId">Ana Kategori</label>
                    <Field
                      component={FormikSelect}
                      id="reg-mId"
                      name="mainCategoryId"
                      options={
                        Array.isArray(categories)
                          ? categories.map((category) => {
                              return { value: category.id, label: category.name };
                            })
                          : []
                      }
                    />
                    {/* <Select
                      id="reg-mId"
                      name="mainCategoryId"
                      value={formik.values.mainCategoryId}
                      options={categories.map((category) => {
                        return { value: category.id, label: category.name };
                      })}
                      onChange={(value) => formik.setFieldValue("mainCategoryId", value?.value || "")}
                    /> */}
                    {formik.errors.mainCategoryId && formik.touched.mainCategoryId ? (
                      <small className="text-danger">{formik.errors.mainCategoryId}</small>
                    ) : null}
                  </div>
                </Col>
                <div className="button">
                  <Button type="submit" disabled={!formik.isValid || !formik.dirty || formik.isSubmitting}>
                    {params?.id ? "Güncelle" : "Ekle"}
                  </Button>
                </div>
              </Form>
            </FormikProvider>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Category;
