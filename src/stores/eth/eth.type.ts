import { ethers } from "ethers";

export type OwnerInfo = {
  name: string;
  description: string;
};

export type EthState = {
  account: string | null;
  ownerInfo: OwnerInfo | null;
  network: ethers.providers.Network | null;
  isSignIn: boolean;
  isLoading: boolean;
  isOwnerRegistered: boolean;
  contractAddress: string;
};
