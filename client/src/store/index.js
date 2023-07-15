import { configureStore } from "@reduxjs/toolkit";
import auth from "./auth";
import product from "./product";
import cart from "./cart";

const store = configureStore({
  reducer: {
    auth,
    product,
    cart
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export default store;
