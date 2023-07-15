import { Link, useLocation } from "react-router-dom";
import { Col, Row } from "reactstrap";

const BreadCrumbs = () => {
  const location = useLocation();
  let currentLink = "";

  const crumbs = location.pathname
    .split("/")
    .filter((crumb) => crumb !== "")
    .map((crumb) => {
      currentLink += `/${crumb}`;
      return <li key={crumb}>{location.pathname === currentLink ? crumb : <Link to={currentLink}>{crumb}</Link>}</li>;
    });

  return (
    <div className="breadcrumbs">
      <div className="container">
        <Row>
          <Col xs="12" md="6" lg="6">
            <div className="breadcrumbs-content">
              <h1 className="page-title">{location.pathname.split("/").at(-1)}</h1>
            </div>
          </Col>
          <Col xs="12" md="6" lg="6">
            <ul className="breadcrumb-nav">{crumbs}</ul>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default BreadCrumbs;
