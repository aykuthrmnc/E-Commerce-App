/* eslint-disable jsx-a11y/anchor-is-valid */
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import { RegisterSchema } from "validation";
import { Helmet } from "react-helmet";
import { Input, Button, Col } from "reactstrap";
import axios from "utils/axios";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();

  const handleSubmit = (values, actions) => {
    axios
      .post("/auth/register", values)
      .then(() => {
        toast.success("Başarılı bir şekilde kaydoldunuz.");
        navigate("/auth/login", {
          replace: true,
        });
      })
      .catch((err) => {
        toast.error(err.response.data);
        actions.setSubmitting(false);
      });
    // if (response) {
    //   navigate(location.state?.return_url || "/", {
    //     replace: true,
    //   });
    // }
  };

  return (
    <>
      <Helmet>
        <title>Kaydol</title>
      </Helmet>

      <div className="register-form">
        <div className="title">
          <h3>Kaydol</h3>
          <p>Hesabınız yok mu? Hemen kaydolun.</p>
        </div>
        <Formik
          validationSchema={RegisterSchema}
          initialValues={{ email: "", firstName: "", lastName: "", phoneNumber: "", username: "", password: "" }}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, dirty, values, handleChange, errors, touched }) => (
            <Form className="row">
              <Col sm={6}>
                <div className="form-group">
                  <label htmlFor="reg-fn">Ad</label>
                  <Input className="form-control" name="firstName" value={values.firstName} onChange={handleChange} id="reg-fn" />
                  {errors.firstName && touched.firstName ? <small className="text-danger">{errors.firstName}</small> : null}
                </div>
              </Col>
              <Col sm={6}>
                <div className="form-group">
                  <label htmlFor="reg-ln">Soyad</label>
                  <Input className="form-control" name="lastName" value={values.lastName} onChange={handleChange} id="reg-ln" />
                  {errors.lastName && touched.lastName ? <small className="text-danger">{errors.lastName}</small> : null}
                </div>
              </Col>
              <Col sm={6}>
                <div className="form-group">
                  <label htmlFor="reg-email">E-posta adresi</label>
                  <Input className="form-control" name="email" type="email" value={values.email} onChange={handleChange} id="reg-email" />
                  {errors.email && touched.email ? <small className="text-danger">{errors.email}</small> : null}
                </div>
              </Col>
              <Col sm={6}>
                <div className="form-group">
                  <label htmlFor="reg-phone">Telefon numarası</label>
                  <Input className="form-control" name="phoneNumber" value={values.phoneNumber} onChange={handleChange} id="reg-phone" />
                  {errors.phoneNumber && touched.phoneNumber ? <small className="text-danger">{errors.phoneNumber}</small> : null}
                </div>
              </Col>
              <Col sm={6}>
                <div className="form-group">
                  <label htmlFor="reg-un">Kullanıcı adı</label>
                  <Input name="username" value={values.username} onChange={handleChange} id="reg-un" />
                  {errors.username && touched.username ? <small className="text-danger">{errors.username}</small> : null}
                </div>
              </Col>
              <Col sm={6}>
                <div className="form-group">
                  <label htmlFor="reg-pass">Şifre</label>
                  <Input className="form-control" name="password" type="password" value={values.password} onChange={handleChange} id="reg-pass" />
                  {errors.password && touched.password ? <small className="text-danger">{errors.password}</small> : null}
                </div>
              </Col>
              <div className="button">
                <Button type="submit" disabled={!dirty || isSubmitting}>
                  Kaydol
                </Button>
              </div>
              <p className="outer-link">
                Hesabın var mı? <Link to="/auth/login">Giriş Yap</Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default Register;
