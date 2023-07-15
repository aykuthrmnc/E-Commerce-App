const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  categories: [
    {
      id: 1,
      name: "Elektronik",
      url: "elektronik",
      description: "Elektronik Kategorisi",
      mainCategoryId: 0,
      subCategories: [
        { id: 8, name: "Bilgisayar", url: "bilgisayar", description: "Bilgisayar Kategorisi", mainCategoryId: 1, subCategories: null },
        { id: 9, name: "Telefon", url: "telefon", description: "Telefon Kategorisi", mainCategoryId: 1, subCategories: null },
        { id: 10, name: "Televizyon", url: "televizyon", description: "Televizyon Kategorisi", mainCategoryId: 1, subCategories: null },
        { id: 11, name: "Beyaz Eşya", url: "beyaz-esya", description: "Beyaz Eşya Kategorisi", mainCategoryId: 1, subCategories: null },
      ],
    }
  ],
};

const product = createSlice({
  name: "product",
  initialState,
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
  },
});

export const { setCategories } = product.actions;
export default product.reducer;
