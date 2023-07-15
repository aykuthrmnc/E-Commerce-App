import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Container } from "reactstrap";

const AdminLayout = () => {
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();

  if (user.roleId !== 1) {
    return <Navigate to={location.state?.return_url || "/"} replace={true} />;
  }

  return (
    <div className="account-login section">
      <Container>
        <Outlet />
      </Container>
    </div>
  );
};

export default AdminLayout;
