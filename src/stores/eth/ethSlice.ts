import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { useSelector } from "react-redux";
import { FreshFood__factory } from "../../types";
import { EthState, OwnerInfo } from "./eth.type";

const initialState: { value: EthState } = {
  value: {
    account: null,
    ownerInfo: null,
    isOwnerRegistered: false,
    isSignIn: false,
    isLoading: true,
    network: null,
    contractAddress: "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512",
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
      state.value = {
        ...state.value,
        ...action.payload,
        isOwnerRegistered: true,
      };
    },

    signOut: (state) => {
      state.value = { ...initialState.value };
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.value.isLoading = action.payload;
    },

    setState: (state, action: PayloadAction<Partial<EthState>>) => {
      state.value = { ...state.value, ...action.payload };
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setLoading,
  signOut,
  connectWallet,
  connectNetwork,
  setState,
  setOwnerInfo,
} = ethSlice.actions;

export const useEth = () =>
  useSelector((state: { eth: { value: EthState } }) => state.eth.value);

export const getContract = () => {
  const eth = useEth();

  if (!eth.account || !ethers.utils.isAddress(eth.account)) return;
  //client side code
  if (!window.ethereum) return;

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  // const provider = new ethers.providers.JsonRpcProvider(
  //   "http://localhost:8545"
  // );

  const contract = FreshFood__factory.connect(
    eth.contractAddress,
    provider.getSigner()
  );

  return contract;
};

export default ethSlice.reducer;
