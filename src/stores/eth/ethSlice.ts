import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { useSelector } from "react-redux";
import { FreshFood__factory } from "../../types";
import { EthState, OwnerInfo } from "./eth.type";

const CONTRACT_ADDRESS = import.meta.env.VITE_APP_CONTRACT_ADDRESS;
export const initialState: { value: EthState } = {
  value: {
    account: null,
    ownerInfo: null,
    isLoading: true,
    contractAddress: CONTRACT_ADDRESS,
  },
};

export const ethSlice = createSlice({
  name: "eth",
  initialState,
  reducers: {
    setOwnerInfo: (state, action: PayloadAction<OwnerInfo>) => {
      state.value = {
        ...state.value,
        ...action.payload,
      };
    },

    signOut: (state) => {
      state.value = { ...initialState.value };
    },

    setEthState: (state, action: PayloadAction<Partial<EthState>>) => {
      state.value = { ...state.value, ...action.payload };
    },

    overrideEthState: (state, action: PayloadAction<Partial<EthState>>) => {
      state.value = {
        ...initialState.value,
        ...action.payload,
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const { overrideEthState, setEthState, setOwnerInfo, signOut } =
  ethSlice.actions;

export const useEth = () =>
  useSelector((state: { eth: { value: EthState } }) => state.eth.value);

export const getContract = () => {
  const provider = window.ethereum
    ? new ethers.providers.Web3Provider(window.ethereum)
    : new ethers.providers.JsonRpcProvider("https://eth.freshfood.lalo.com.vn");

  const contract = FreshFood__factory.connect(
    CONTRACT_ADDRESS,
    provider.getSigner()
  );
  return contract;
};

export default ethSlice.reducer;
