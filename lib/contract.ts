import { ethers } from "ethers";
import { EvmAbiItem } from "@moralisweb3/common-evm-utils";

// Define the ABI in the correct Moralis format
export const MIXER_ABI: EvmAbiItem[] = [
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "commitment",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        indexed: false,
        name: "leafIndex",
        type: "uint32",
        internalType: "uint32",
      },
      {
        indexed: false,
        name: "timestamp",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    name: "Deposit",
  },
  {
    type: "function",
    name: "deposit",
    inputs: [
      {
        name: "_commitment",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "withdraw",
    inputs: [
      {
        name: "_nullifierHash",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "_recipient",
        type: "address",
        internalType: "address payable",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
];

export const MIXER_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_MIXER_CONTRACT_ADDRESS || "";

export function getMixerContract(signer: ethers.Signer) {
  return new ethers.Contract(MIXER_CONTRACT_ADDRESS, MIXER_ABI, signer);
}
