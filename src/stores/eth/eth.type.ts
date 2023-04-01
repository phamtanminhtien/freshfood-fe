import { ethers } from "ethers";

export type OwnerInfo = {
  name: string;
  description: string;
};

export type EthState = {
  account: string | null;
  ownerInfo: OwnerInfo | null;
  isLoading: boolean;
  contractAddress: string;
};
