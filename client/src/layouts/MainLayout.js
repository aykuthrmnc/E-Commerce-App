import Footer from "components/Containers/Footer";
import Header from "components/Containers/Header";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { getCategoriesHandle } from "utils";

const MainLayout = () => {
  const categories = useSelector((state) => state.product.categories);
  // const location = useLocation();

  useEffect(() => {
    categories.length === 0 && getCategoriesHandle();
  }, [categories.length]);

  return (
    <>
      <Header />
      {/* {location.pathname !== "/" && <BreadCrumbs />} */}
      <Outlet />
      <Footer />
    </>
  );
};

export default MainLayout;
