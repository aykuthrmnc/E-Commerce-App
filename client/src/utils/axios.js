import axios from "axios";
import store from "store";
import { userLogoutHandle } from "utils";
import { history } from "./Router/history";

const instance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

// instance.defaults.baseURL = process.env.REACT_APP_BASE_URL;
// instance.defaults.headers.common["Authorization"] = `Bearer ${(JSON.parse(localStorage.getItem(process.env.REACT_APP_AUTH_SESSION_KEY)))?.token}`;
// instance.defaults.headers.common["Content-Type"] = "application/json";

instance.interceptors.request.use(
  (config) => {
    if (!config.headers.Authorization) {
      const token = store.getState().auth.user.token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // alert('error');
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // throw new Error('error');
    let message;

    if (error?.response?.status === 404) {
      message = error?.response.data;
      // window.location.href = '/not-found';
    } else if (error?.response?.status === 403) {
      // window.location.href = '/access-denied';
      message = error;
    } else {
      switch (error?.response?.status) {
        case 401:
          message = "Yetki Yok";
          userLogoutHandle();
          history.replace("/auth/login");

          // const dispatch = useDispatch();
          // dispatch(logoutUser());
          // sessionStorage.removeItem(REACT_APP_AUTH_SESSION_KEY);
          // const navigate = useNavigate();
          // navigate("/auth/login", { replace: true }); // Usage example.
          break;
        case 403:
          message = "Access Forbidden";
          break;
        case 404:
          message = "Sorry! the data you are looking for could not be found";
          break;
        case 505:
          window.location.href = "/error-500";
          break;
        default: {
          message = error;
        }
      }
      // Alert
      // return message;
    }
    return Promise.reject(message);
  }
);

export default instance;

// instance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response.status === 401) {
//       userLogoutHandle();
//       const dispatch = useDispatch();
//       dispatch(logoutUser())
//       sessionStorage.removeItem(REACT_APP_AUTH_SESSION_KEY);
//       const navigate = useNavigate();
//       navigate("/auth/login", { replace: true }); // Usage example.
//     }
//     return Promise.reject(error);
//   }
// );
