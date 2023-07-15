import { Link } from "react-router-dom";
import { Formik, Form } from "formik";
import { LoginSchema } from "validation";
import { Helmet } from "react-helmet";
import { Input, Button } from "reactstrap";
import axios from "utils/axios";
import { toast } from "react-toastify";
import { userLoginHandle } from "utils";

const Login = () => {
  const handleSubmit = (values, actions) => {
    axios
      .post("/auth/login", values)
      .then((res) => {
        userLoginHandle(res.data);
        // actions.resetForm();
      })
      .catch((err) => {
        toast.error(err.response.data);
      });
    actions.setSubmitting(false);
  };

  return (
    <>
      <Helmet>
        <title>Giriş Yap</title>
      </Helmet>
      <Formik validationSchema={LoginSchema} initialValues={{ username: "", password: "" }} onSubmit={handleSubmit}>
        {({ isSubmitting, isValid, dirty, values, handleChange, errors, touched }) => (
          <Form className="card login-form">
            <div className="card-body">
              <div className="title">
                <h3>Giriş Yap</h3>
                <p>E-posta adresinizi kullanarak giriş yapabilirsiniz.</p>
              </div>
              {/* <div className="social-login">
                <Row>
                  <Col xs="12" md="4" lg="4">
                    <a className="btn facebook-btn" href="# ">
                      <i className="lni lni-facebook-filled" /> Facebook
                    </a>
                  </Col>
                  <Col xs="12" md="4" lg="4">
                    <a className="btn twitter-btn" href="# ">
                      <i className="lni lni-twitter-original" /> Twitter
                    </a>
                  </Col>
                  <Col xs="12" md="4" lg="4">
                    <a className="btn google-btn" href="# ">
                      <i className="lni lni-google" /> Google
                    </a>
                  </Col>
                </Row>
              </div>
              <div className="alt-option">
                <span>veya</span>
              </div> */}
              <div className="form-group input-group">
                <label htmlFor="reg-un">Kullanıcı adı</label>
                <Input className="form-control" name="username" value={values.username} onChange={handleChange} id="reg-un" />
                {errors.username && touched.username ? <small className="text-danger">{errors.username}</small> : null}
              </div>
              <div className="form-group input-group">
                <label htmlFor="reg-pass">Şifre</label>
                <Input className="form-control" name="password" value={values.password} onChange={handleChange} type="password" id="reg-pass" />
                {errors.password && touched.password ? <small className="text-danger">{errors.password}</small> : null}
              </div>
              <div className="d-flex flex-wrap justify-content-between bottom-content">
                <div className="form-check">
                  <Input type="checkbox" className="form-check-input width-auto" id="reg-rm" />
                  <label className="form-check-label" htmlFor="reg-rm">
                    Beni hatırla
                  </label>
                </div>
                <Link to="/auth" className="lost-pass">
                  Şifreni mi unuttun?
                </Link>
              </div>
              <div className="button">
                <Button type="submit" disabled={!isValid || !dirty || isSubmitting}>
                  Giriş yap
                </Button>
              </div>
              <p className="outer-link">
                Hesabın yok mu? <Link to="/auth/register">Kaydol</Link>
              </p>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default Login;
