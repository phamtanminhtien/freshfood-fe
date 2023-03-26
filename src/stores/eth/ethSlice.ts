import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EthState } from "./eth.type";

const initialState: EthState = {
  account: null,
  ownerInfo: null,
  isSignIn: false,
  isOwnerRegistered: false,
  isLoading: false,
};

type SignInPayload = PayloadAction<Pick<EthState, "account" | "ownerInfo">>;

export const ethSlice = createSlice({
  name: "eth",
  initialState,
  reducers: {
    signIn: (state, action: SignInPayload) => {
      state = { ...state, isSignIn: true, ...action.payload };
    },
    signOut: (state) => {
      state = { ...initialState };
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setLoading, signIn, signOut } = ethSlice.actions;

export default ethSlice.reducer;
