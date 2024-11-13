import { ethers } from "ethers";
import { ALCHEMY_RPC_URL } from "./config";

export const getProvider = () => {
  return new ethers.JsonRpcProvider(ALCHEMY_RPC_URL);
};
