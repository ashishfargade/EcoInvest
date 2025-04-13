import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axiosInstance from "../../app/api/axiosInstance.js";

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false, // Track loading state for UI feedback (optional) - @todo later
  error: null, // Tracking errors for UI feedback (optional) - @todo later
};

export const signup = createAsyncThunk(
  "user/signup",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      await axiosInstance.post("/user/register", { name, email, password });
      // nothing to return in this
      console.log("Signup asyncThunk success"); // @todo - remove
    } catch (err) {
      // err is already { status, message } from axios interceptor
      console.log("Error in signup async thunk: ", err.message);
      return rejectWithValue(err);
    }
  }
);

export const login = createAsyncThunk(
  "user/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/user/login", {
        email,
        password,
      });

      console.log(response); // @todo remove

      return response.data.user;
      // return user
    } catch (err) {
      console.log("Error in login async thunk: ", err.message); // @todo modify this
      return rejectWithValue(err);
    }
  }
);

export const getLoggedUser = createAsyncThunk(
  "user/getLoggedUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/user/currentUser");
      console.log(response);
      return response.data.user;
    } catch (err) {
      console.log("Error in getLoggedUser async thunk:", err.message); // @todo modify this
      return rejectWithValue(err);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state) => {
        state.loading = false;
        console.log("Signup fulfilled"); // @todo remove
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Unknown error";
        console.log(state); // @todo remove
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;

        sessionStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
        console.log(state); // @todo remove
      })
      .addCase(getLoggedUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        // console.log(state); // @todo remove
      })
      .addCase(getLoggedUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;

        sessionStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(getLoggedUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
        state.user = null;
        state.isAuthenticated = false;

        sessionStorage.removeItem("user");
      });
  },
});

export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectLoading = (state) => state.auth.loading;
export const selectError = (state) => state.auth.error;

export default authSlice.reducer;
