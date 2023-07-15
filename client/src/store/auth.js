const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  user: JSON.parse(localStorage.getItem(process.env.REACT_APP_AUTH_SESSION_KEY)) || false,
  // user: null,
};

const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      if (action.payload) {
        localStorage.setItem(process.env.REACT_APP_AUTH_SESSION_KEY, JSON.stringify(action.payload));
      } else {
        localStorage.removeItem(process.env.REACT_APP_AUTH_SESSION_KEY);
      }
      state.user = action.payload;
    },
    logoutUser: (state, action) => {
      state.user = false;
      localStorage.removeItem(process.env.REACT_APP_AUTH_SESSION_KEY);
    },
  },
});

export const { setUser, logoutUser } = auth.actions;
export default auth.reducer;
