import { createSlice } from "@reduxjs/toolkit";
import { User } from "../../types/user";

type State = {
  authenticated: boolean;
  cuurentUser: User | null;
};

const initialState: State = {
  authenticated: false,
  cuurentUser: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signIn: (state, action) => {
      state.authenticated = true;
      state.cuurentUser = {
        email: action.payload.email,
        photoURL: "/user.png",
      };
    },
    signOut: (state) => {
      state.authenticated = false;
      state.cuurentUser = null;
    },
  },
});

export const { signIn, signOut } = authSlice.actions;
