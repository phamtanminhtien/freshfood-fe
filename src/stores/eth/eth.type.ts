export type OwnerInfo = {};

export type EthState = {
  account: string | null;
  ownerInfo: OwnerInfo | null;
  isSignIn: boolean;
  isLoading: boolean;
  isOwnerRegistered: boolean;
};
