/// <reference types="vite/client" />

/// <reference types="react-scripts" />
import { ExternalProvider } from "ethers";

declare global {
  interface Window {
    ethereum?: ExternalProvider;
  }
}
