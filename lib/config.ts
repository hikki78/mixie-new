import { Alchemy, Network } from 'alchemy-sdk';

export const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID || '11155111';
export const ALCHEMY_RPC_URL = process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL;
export const MIXER_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_MIXER_CONTRACT_ADDRESS;
export const MORALIS_API_KEY = process.env.NEXT_PUBLIC_MORALIS_API_KEY;
export const ZEROX_API_KEY = process.env.NEXT_PUBLIC_0X_API_KEY;

if (!ALCHEMY_RPC_URL) {
  throw new Error('Missing Alchemy RPC URL configuration');
}

if (!MORALIS_API_KEY) {
  throw new Error('Missing Moralis API key');
}

if (!ZEROX_API_KEY) {
  throw new Error('Missing 0x API key');
}

// Initialize Alchemy SDK
export const alchemy = new Alchemy({
  url: ALCHEMY_RPC_URL,
  network: CHAIN_ID === '1' ? Network.ETH_MAINNET : Network.ETH_SEPOLIA,
});

export const getNetworkName = () => {
  switch (CHAIN_ID) {
    case '1':
      return 'Ethereum Mainnet';
    case '11155111':
      return 'Sepolia Testnet';
    default:
      return 'Unknown Network';
  }
};