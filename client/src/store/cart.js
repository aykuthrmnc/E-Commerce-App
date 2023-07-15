const { createSlice } = require("@reduxjs/toolkit");

const initialState = {};

const cart = createSlice({
  name: "cart",
  initialState,
  reducers: {
    getCart: (state, action) => {
      state.carts = action.payload;
    },
    setCart: (state, action) => {
      let index = state.carts.findIndex(({ id }) => id === action.payload.id);
      if (index !== -1) {
        state.carts[index] = action.payload;
      } else {
        state.carts = [...state.carts, action.payload];
      }
      // const updatedItems = items.map(el => el.id === item.id ? item : el)
    },
    removeCart: (state, action) => {
      state.carts = state.carts.filter((i) => i.id !== action.payload);
    },
    clearCart: (state) => {
      state.carts = []
    }
  },
});

export const { getCart, setCart, removeCart, clearCart } = cart.actions;
export default cart.reducer;
