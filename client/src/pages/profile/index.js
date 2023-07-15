import { Form, useFormik, FormikProvider } from "formik";
import { Helmet } from "react-helmet";
import { Input, Button, Col, Row, Container } from "reactstrap";
import { ProfileSchema } from "validation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const Profile = () => {
  const user = useSelector((state) => state.auth.user);

  const updateHandle = (values, actions) => {
    console.log(values);
  };

  const formik = useFormik({
    initialValues: { username: "", email: "", firstName: "", lastName: "", phoneNumber: "" },
    validationSchema: ProfileSchema,
    onSubmit: updateHandle,
  });

  useEffect(() => {
    formik.setValues({
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
    });
  }, [user]);

  return (
    <>
      <Helmet>
        <title>Profil</title>
      </Helmet>

      <div className="account-login section">
        <Container>
          <Row className="g-3">
            <Col xs={12} md={10} lg={6} className="mx-auto">
              <div className="register-form">
                <div className="title">
                  <h3>Profili Düzenle</h3>
                </div>
                <FormikProvider value={formik}>
                  <Form className="row">
                    <Col sm={6}>
                      <div className="form-group">
                        <label htmlFor="firstName">Ad</label>
                        <Input
                          id="firstName"
                          className="form-control"
                          name="firstName"
                          value={formik.values.firstName}
                          onChange={formik.handleChange}
                        />
                        {formik.errors.firstName && formik.touched.firstName ? (
                          <small className="text-danger">{formik.errors.firstName}</small>
                        ) : null}
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div className="form-group">
                        <label htmlFor="lastName">Soyad</label>
                        <Input id="lastName" className="form-control" name="lastName" value={formik.values.lastName} onChange={formik.handleChange} />
                        {formik.errors.lastName && formik.touched.lastName ? <small className="text-danger">{formik.errors.lastName}</small> : null}
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div className="form-group">
                        <label htmlFor="email">E-posta adresi</label>
                        <Input id="email" className="form-control" name="email" value={formik.values.email} onChange={formik.handleChange} />
                        {formik.errors.email && formik.touched.email ? <small className="text-danger">{formik.errors.email}</small> : null}
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div className="form-group">
                        <label htmlFor="phoneNumber">Telefon numarası</label>
                        <Input
                          id="phoneNumber"
                          className="form-control"
                          name="phoneNumber"
                          value={formik.values.phoneNumber}
                          onChange={formik.handleChange}
                        />
                        {formik.errors.phoneNumber && formik.touched.phoneNumber ? (
                          <small className="text-danger">{formik.errors.phoneNumber}</small>
                        ) : null}
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div className="form-group">
                        <label htmlFor="username">Kullanıcı adı</label>
                        <Input id="username" className="form-control" name="username" value={formik.values.username} onChange={formik.handleChange} />
                        {formik.errors.username && formik.touched.username ? <small className="text-danger">{formik.errors.username}</small> : null}
                      </div>
                    </Col>
                    <div className="button">
                      <Button type="submit" disabled={!formik.dirty || formik.isSubmitting}>
                        Güncelle
                      </Button>
                    </div>
                  </Form>
                </FormikProvider>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Profile;
