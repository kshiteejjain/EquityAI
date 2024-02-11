// loginSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { usersCollectionData } from "../../utils/firebase";
import { query, where, getDocs } from 'firebase/firestore';
export const loginSlice = createSlice({
  name: "login",
  initialState: {
    isLoggedIn: false,
    username: "",
    error: null,
  },
  reducers: {
    LOGIN_SUCCESS: (state, action) => {
      state.isLoggedIn = true;
      state.username = action.payload.username;
      state.error = null;
    },
    LOGIN_FAILURE: (state, action) => {
      state.isLoggedIn = false;
      state.username = "";
      state.error = action.payload.error;
    },
  },
});
export const { LOGIN_SUCCESS, LOGIN_FAILURE } = loginSlice.actions;
export const loginAsync = (email, password) => async (dispatch) => {
  try {
    const usersCollection = usersCollectionData;
    const querySnapshot = await getDocs(query(usersCollection, where("email", "==", email)));
    if (querySnapshot.docs.length > 0) {
      const user = querySnapshot.docs[0].data();
      if (user.password === password) {
        dispatch(LOGIN_SUCCESS({ username: user.username }));
      } else {
        dispatch(LOGIN_FAILURE({ error: "Invalid credentials" }));
      }
    } else {
      dispatch(LOGIN_FAILURE({ error: "Invalid credentials" }));
    }
  } catch (error) {
    dispatch(LOGIN_FAILURE({ error: error.message }));
  }
};
export const selectLogin = (state) => state.login;
export default loginSlice.reducer;
