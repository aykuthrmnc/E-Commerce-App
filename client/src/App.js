import { useRoutes } from "react-router-dom";
import routes from "routes";
import { ToastContainer } from "react-toastify";
import { Suspense } from "react";
import Loader from "components/Loaders/Loader";
import ScrollToTop from "components/ScrollToTop";

const App = () => {
  const showRoutes = useRoutes(routes);

  return (
    <>
      {/* {<Loader />} */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        limit={5}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Suspense fallback={<Loader />}>{showRoutes}</Suspense>
      <ScrollToTop />
    </>
  );
};

export default App;
