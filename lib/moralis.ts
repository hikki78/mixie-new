import Moralis from 'moralis';
import { ethers } from 'ethers';
import { ALCHEMY_RPC_URL, MORALIS_API_KEY } from './config';

if (!Moralis.Core.isStarted) {
  await Moralis.start({
    apiKey: MORALIS_API_KEY,
  });
}

export const getProvider = () => {
  return new ethers.JsonRpcProvider(ALCHEMY_RPC_URL);
};

export { Moralis };