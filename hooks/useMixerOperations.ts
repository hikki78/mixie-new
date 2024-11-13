"use client";

import {
  BrowserProvider,
  Contract,
  keccak256,
  AbiCoder,
  randomBytes,
  parseEther,
  hexlify,
} from "ethers";
import { MIXER_CONTRACT_ADDRESS, MIXER_ABI } from "@/lib/contract";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export function useMixerOperations() {
  const deposit = async (
    amount: string,
    recipientAddress: string
  ): Promise<string> => {
    if (typeof window === "undefined" || !window.ethereum) {
      throw new Error("MetaMask is not installed");
    }

    if (parseFloat(amount) < 0.001) {
      throw new Error("Please deposit at least 0.001 SepoliaETH");
    }

    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new Contract(MIXER_CONTRACT_ADDRESS, MIXER_ABI, signer);

    // Generate commitment using recipient address and random value
    const randomValue = randomBytes(32);
    const commitment = keccak256(
      AbiCoder.defaultAbiCoder().encode(
        ["address", "bytes32"],
        [recipientAddress, randomValue]
      )
    );

    // Store deposit data
    const depositData = {
      commitment,
      amount,
      timestamp: Date.now(),
      recipient: recipientAddress,
      status: "pending",
      randomValue: hexlify(randomValue),
    };

    localStorage.setItem(`mixer_${commitment}`, JSON.stringify(depositData));

    // Send transaction
    const tx = await contract.deposit(commitment, {
      value: parseEther(amount),
    });

    await tx.wait();

    // Update deposit status
    depositData.status = "completed";
    localStorage.setItem(`mixer_${commitment}`, JSON.stringify(depositData));

    return commitment;
  };

  const withdraw = async (commitment: string): Promise<string> => {
    if (typeof window === "undefined" || !window.ethereum) {
      throw new Error("MetaMask is not installed");
    }

    const depositData = JSON.parse(
      localStorage.getItem(`mixer_${commitment}`) || "{}"
    );
    if (!depositData.randomValue || !depositData.recipient) {
      throw new Error("Invalid commitment or deposit data not found");
    }

    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new Contract(MIXER_CONTRACT_ADDRESS, MIXER_ABI, signer);

    const nullifierHash = keccak256(
      AbiCoder.defaultAbiCoder().encode(
        ["bytes32", "address"],
        [depositData.randomValue, depositData.recipient]
      )
    );

    const tx = await contract.withdraw(nullifierHash, depositData.recipient);
    const receipt = await tx.wait();

    // Remove deposit data after successful withdrawal
    localStorage.removeItem(`mixer_${commitment}`);

    return receipt.hash;
  };

  return {
    deposit,
    withdraw,
  };
}
