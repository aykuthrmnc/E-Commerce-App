import axios from "utils/axios";

export const fetchOrders = async () => {
  const response = await axios.get("/order");
  return response.data;
};

export const fetchProduct = async (id) => {
  const response = await axios.get(`/products/${id}`);
  return response.data;
};

export const fetchProductRatings = async (id, pageNo, pageSize) => {
  const response = await axios.get(`/productratings/${id}?pageNo=${pageNo}&pageSize=${pageSize}`);
  return response.data;
};

export const fetchSearch = async (value = "", pageNo, pageSize) => {
  const response = await axios.get(`/search?search=${value}&pageNo=${pageNo}&pageSize=${pageSize}`);
  return response.data;
};
