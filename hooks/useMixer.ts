"use client";

import { useState } from "react";
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

type DepositStatus = "pending" | "completed";

interface Deposit {
  commitment: string;
  amount: string;
  timestamp: number;
  recipient: string;
  status: DepositStatus;
}

export interface MixerState {
  deposits: Deposit[];
  totalDeposited: string;
}

interface DepositData {
  commitment: string;
  amount: string;
  timestamp: number;
  recipient: string;
  status: DepositStatus;
  randomValue: string;
}

export function useMixer() {
  const [state, setState] = useState<MixerState>({
    deposits: [],
    totalDeposited: "0",
  });
  const [isLoading, setIsLoading] = useState(true);

  const getMixerContract = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      throw new Error("MetaMask is not installed");
    }

    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new Contract(MIXER_CONTRACT_ADDRESS, MIXER_ABI, signer);
  };

  const handleTransaction = async (
    commitment: string,
    status: DepositStatus,
    amount: string
  ) => {
    const deposits = [...state.deposits];
    const depositIndex = deposits.findIndex((d) => d.commitment === commitment);

    if (depositIndex >= 0) {
      deposits[depositIndex].status = status;
    } else {
      deposits.push({
        commitment,
        amount,
        timestamp: Date.now(),
        recipient: "",
        status,
      });
    }

    const totalDeposited = deposits
      .filter((d) => d.status === "completed")
      .reduce((acc, curr) => acc + parseFloat(curr.amount), 0)
      .toString();

    setState({ deposits, totalDeposited });
  };

  const deposit = async (
    amount: string,
    recipientAddress: string
  ): Promise<string> => {
    try {
      setIsLoading(true);

      if (parseFloat(amount) < 0.001) {
        throw new Error("Please deposit at least 0.001 SepoliaETH");
      }

      // Generate commitment
      const randomValue = randomBytes(32);
      const commitment = keccak256(
        AbiCoder.defaultAbiCoder().encode(
          ["address", "bytes32"],
          [recipientAddress, randomValue]
        )
      );

      // Store deposit data
      const depositData: DepositData = {
        commitment,
        amount,
        timestamp: Date.now(),
        recipient: recipientAddress,
        status: "pending",
        randomValue: hexlify(randomValue),
      };

      localStorage.setItem(`mixer_${commitment}`, JSON.stringify(depositData));
      await handleTransaction(commitment, "pending", amount);

      // Send transaction
      const contract = await getMixerContract();
      const tx = await contract.deposit(commitment, {
        value: parseEther(amount),
      });

      await tx.wait();

      // Update deposit status
      depositData.status = "completed";
      localStorage.setItem(`mixer_${commitment}`, JSON.stringify(depositData));
      await handleTransaction(commitment, "completed", amount);

      return commitment;
    } catch (error: any) {
      console.error("Deposit error:", error);
      throw new Error(error.message || "Failed to deposit funds");
    } finally {
      setIsLoading(false);
    }
  };

  const withdraw = async (commitment: string): Promise<string> => {
    try {
      setIsLoading(true);

      const depositData = JSON.parse(
        localStorage.getItem(`mixer_${commitment}`) || "{}"
      ) as DepositData;
      if (!depositData.randomValue || !depositData.recipient) {
        throw new Error("Invalid commitment or deposit data not found");
      }

      const nullifierHash = keccak256(
        AbiCoder.defaultAbiCoder().encode(
          ["bytes32", "address"],
          [depositData.randomValue, depositData.recipient]
        )
      );

      const contract = await getMixerContract();
      const tx = await contract.withdraw(nullifierHash, depositData.recipient);
      const receipt = await tx.wait();

      // Remove deposit data after successful withdrawal
      localStorage.removeItem(`mixer_${commitment}`);

      // Update state
      const deposits = state.deposits.filter(
        (d) => d.commitment !== commitment
      );
      setState({
        deposits,
        totalDeposited: deposits
          .filter((d) => d.status === "completed")
          .reduce((acc, curr) => acc + parseFloat(curr.amount), 0)
          .toString(),
      });

      return receipt.hash;
    } catch (error: any) {
      console.error("Withdrawal error:", error);
      throw new Error(error.message || "Failed to withdraw funds");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    state,
    isLoading,
    deposit,
    withdraw,
  };
}
