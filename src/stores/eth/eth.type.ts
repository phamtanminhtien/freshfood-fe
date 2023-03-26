import { ethers } from "ethers";

export type OwnerInfo = {};

export type EthState = {
  account: string | null;
  ownerInfo: OwnerInfo | null;
  network: ethers.providers.Network | null;
  isSignIn: boolean;
  isLoading: boolean;
  isOwnerRegistered: boolean;
};
