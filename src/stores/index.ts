import { configureStore } from "@reduxjs/toolkit";
import ethSlice from "./eth/ethSlice";

export default configureStore({
  reducer: {
    eth: ethSlice,
  },
});
