import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";

const AuthLayout = () => {
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();

  if (user) {
    return <Navigate to={location.state?.return_url || "/"} replace={true} />;
  }

  return (
    <div className="account-login section">
      <Container>
        <Row>
          <Col xs={12} md={10} lg={6} className="offset-lg-3 offset-md-1">
            <Outlet />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AuthLayout;
