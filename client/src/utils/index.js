import store from "store";
import { logoutUser, setUser } from "store/auth";
import { getCart, setCart, removeCart, clearCart } from "store/cart";
import { setCategories } from "store/product";
import axios from "utils/axios";
import { toast } from "react-toastify";

//! USER
export const userLoginHandle = (data) => {
  store.dispatch(setUser(data));
};

export const userLogoutHandle = () => {
  store.dispatch(logoutUser());
  store.dispatch(clearCart());
};

//! CATEGORY
export const getCategoriesHandle = () => {
  axios
    .get("/categories")
    .then((res) => {
      store.dispatch(setCategories(res.data));
    })
    .catch((err) => console.log(err));
};

export const removeCategoryHandle = (category) => {
  axios
    .delete(`/categories/${category.id}`)
    .then(() => {
      getCategoriesHandle();
    })
    .catch(() => {
      toast.error("Kategori silinemedi.");
    });
};

export const addOrUpdateCategoryHandle = (values, actions) => {
  if (values.id) {
    axios
      .put(`/categories`, { ...values, mainCategoryId: values.mainCategoryId === "" ? 0 : values.mainCategoryId })
      .then((res) => {
        toast.success("Kategori başarıyla güncellendi.");
        getCategoriesHandle();
      })
      .catch((err) => {
        toast.error(err.response.data);
      }).finally(() => {
        actions.setSubmitting(false);
      });
  } else {
    axios
      .post("/categories", { ...values, mainCategoryId: values.mainCategoryId === "" ? 0 : values.mainCategoryId })
      .then((res) => {
        toast.success("Kategori başarıyla eklendi");
        actions.resetForm();
        getCategoriesHandle();
      })
      .catch((err) => {
        toast.error(err.response.data);
      }).finally(() => {
        actions.setSubmitting(false);
      });
  }
};

//! PRODUCT

export const addOrUpdateProductHandle = (values, actions) => {
  const formData = new FormData();
  for (const value in values) {
    formData.append(value, values[value]);
  }

  if (values.id) {
    axios
      .put("/products", formData)
      .then((res) => {
        toast.success("Ürün Başarıyla Güncellendi.");
      })
      .catch((err) => {
        toast.error(err.response.data);
      }).finally(() => {
        actions.setSubmitting(false);
      });
  } else {
    axios
      .post("/products", formData)
      .then((res) => {
        toast.success("Ürün Başarıyla Eklendi");
        actions.resetForm();
      })
      .catch((err) => {
        toast.error(err.response.data);
      }).finally(() => {
        actions.setSubmitting(false);
      });
  }
};

export const addProductImageHandle = (values, actions) => {
  const formData = new FormData();
  for (const value in values) {
    if (value == "file") {
      for (const val of values[value]) {
        formData.append(value, val);
      }
    } else {
      formData.append(value, values[value]);
    }
  }

  axios
    .post("/products/multipleimages", formData)
    .then((res) => {
      toast.success("Ürün detay resimleri başarıyla eklendi.");
      actions.resetForm();
    })
    .catch((err) => {
      toast.error(err.response.data);
    }).finally(() => {
      actions.setSubmitting(false);
    });
};

export const removeProductHandle = (product) => {
  axios
    .delete(`/products/${product.id}`)
    .then(() => {
      toast.success("Ürün başarıyla silindi.");
    })
    .catch(() => {
      toast.error("Ürün silinemedi.");
    });
};

// export const updateCategoriesHandle = () => {
//   axios
//     .get("/categories")
//     .then((res) => {
//       store.dispatch(setCategories(res.data));
//     })
//     .catch((err) => console.log(err));
// };

// export const deleteCategoriesHandle = () => {
//   axios
//     .get("/categories")
//     .then((res) => {
//       store.dispatch(setCategories(res.data));
//     })
//     .catch((err) => console.log(err));
// };

//! CART

export const getCartHandle = () => {
  axios
    .get("/cart")
    .then((res) => {
      store.dispatch(getCart(res.data));
    })
    .catch((err) => console.log(err));
};

export const addCartHandle = (productId, quantity = 1) => {
  axios
    .post("/cart", { productId, quantity })
    .then((res) => {
      toast.success("Sepete başarıyla eklendi.");
      store.dispatch(setCart(res.data));
    })
    .catch((err) => console.log(err));
};

export const updateCartHandle = (productId, quantity = 1) => {
  axios.put("/cart", { productId, quantity }).then((res) => {
    toast.success("Sepet başarıyla güncellendi.");
    store.dispatch(setCart(res.data));
  });
};

export const removeCartHandle = (id) => {
  axios
    .delete(`/cart/${id}`)
    .then(() => {
      toast.success("Ürün sepetten kaldırıldı.");
      store.dispatch(removeCart(id));
    })
    .catch((err) => console.log(err));
};

export const clearCartHandle = () => {
  store.dispatch(clearCart());
};
