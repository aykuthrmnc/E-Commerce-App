import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
// import { BrowserRouter, unstable_HistoryRouter as HistoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "store";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/LineIcons.3.0.css";
import "./assets/css/main.css";
import "./assets/css/style.css";

import "bootstrap/dist/js/bootstrap.bundle";
import "./index.scss";

// TOASTIFY
import "react-toastify/dist/ReactToastify.css";

// SWIPER SLIDER
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/navigation";

// ROUTER
import { history } from "utils/Router/history";
import { CustomRouter } from "utils/Router/CustomRouter";

// REACT-QUERY
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 60000, refetchOnWindowFocus: false } } });

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <CustomRouter history={history}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </CustomRouter>
  </Provider>
);
