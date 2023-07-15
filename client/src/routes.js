import { lazy } from "react";

const PrivateRoute = lazy(() => import("layouts/PrivateRoute"));
const AuthLayout = lazy(() => import("layouts/AuthLayout"));
const MainLayout = lazy(() => import("layouts/MainLayout"));
const AdminLayout = lazy(() => import("layouts/AdminLayout"));
const ProfileLayout = lazy(() => import("layouts/ProfileLayout"));

const Home = lazy(() => import("pages/Home"));
const Page404 = lazy(() => import("pages/Page404"));
const Mail = lazy(() => import("pages/Mail"));
const Login = lazy(() => import("pages/auth/Login"));
const Register = lazy(() => import("pages/auth/Register"));

const Search = lazy(() => import("pages/product/Search"));
const Product = lazy(() => import("pages/product/Product"));
const ProductList = lazy(() => import("pages/product/ProductList"));

const Profile = lazy(() => import("pages/profile"));
const Cart = lazy(() => import("pages/profile/Cart"));
const Order = lazy(() => import("pages/profile/Order"));
const Checkout = lazy(() => import("pages/profile/Checkout"));

const AdminCategoryList = lazy(() => import("pages/admin/CategoryList"));
const AdminCategory = lazy(() => import("pages/admin/Category"));
const AdminProductList = lazy(() => import("pages/admin/ProductList"));
const AdminProduct = lazy(() => import("pages/admin/Product"));
const AdminProductImages = lazy(() => import("pages/admin/ProductImages"));

const routes = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "auth",
        element: <AuthLayout />,
        children: [
          {
            path: "login",
            element: <Login />,
          },
          {
            path: "register",
            element: <Register />,
          },
        ],
      },
      {
        path: "admin",
        element: <AdminLayout />,
        auth: true,
        admin: true,
        children: [
          // {
          //   index: true,
          //   element: <Admin />,
          // },
          {
            path: "categories",
            element: <AdminCategoryList />,
          },
          {
            path: "category/:id?",
            element: <AdminCategory />,
          },
          {
            path: "products",
            element: <AdminProductList />,
          },
          {
            path: "product/:id?",
            element: <AdminProduct />,
          },
          {
            path: "productImages/:id?",
            element: <AdminProductImages />,
          },
        ],
      },
      {
        path: "profile",
        element: <ProfileLayout />,
        auth: true,
        children: [
          {
            index:true,
            element: <Profile />,
          },
          {
            path: "cart",
            element: <Cart />,
          },
          {
            path: "checkout",
            element: <Checkout />,
          },
          {
            path: "order",
            element: <Order />,
          },
        ],
      },
      {
        path: "search",
        element: <Search />,
      },
      {
        path: ":url-kategorisi",
        element: <ProductList />,
      },
      {
        path: ":id",
        element: <Product />,
      },
    ],
  },
  {
    path: "/mail",
    element: <Mail />,
  },
  {
    name: "notFound",
    path: "*",
    element: <Page404 />,
  },
];

const authCheck = (routes) =>
  routes.map((route) => {
    if (route?.auth) {
      route.element = <PrivateRoute>{route.element}</PrivateRoute>;
    }
    if (route?.children) {
      route.children = authCheck(route.children);
    }
    return route;
  });

// export const getRoute = (pathname, routess = routes) => {
//   routess.map((route) => {
//     if (route.path === pathname) {
//       return route;
//     }
//     if (route?.children) {
//       getRoute(pathname, route.children);
//     }
//   });
// };

export default authCheck(routes);
