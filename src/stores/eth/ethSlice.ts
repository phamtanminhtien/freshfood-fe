import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { useSelector } from "react-redux";
import { EthState, OwnerInfo } from "./eth.type";

const initialState: { value: EthState } = {
  value: {
    account: null,
    ownerInfo: null,
    isOwnerRegistered: false,
    isSignIn: false,
    isLoading: true,
    network: null,
  },
};

export const ethSlice = createSlice({
  name: "eth",
  initialState,
  reducers: {
    connectNetwork: (
      state,
      action: PayloadAction<Pick<EthState, "network">>
    ) => {
      state.value = { ...state.value, ...action.payload };
    },

    connectWallet: (state, action: PayloadAction<string | null>) => {
      state.value = {
        ...state.value,
        account: action.payload,
        isSignIn: true,
        isLoading: false,
      };
    },

    setOwnerInfo: (state, action: PayloadAction<OwnerInfo>) => {
      state.value = { ...state.value, ...action.payload };
    },

    signOut: (state) => {
      state.value = { ...initialState.value };
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.value.isLoading = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setLoading,
  signOut,
  connectWallet,
  connectNetwork,
  setOwnerInfo,
} = ethSlice.actions;

export const useEth = () =>
  useSelector((state: { eth: { value: EthState } }) => state.eth.value);

export default ethSlice.reducer;
