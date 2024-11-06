"use client";

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Moralis } from '@/lib/moralis';
import { getMixerContract } from '@/lib/contract';

export interface MixerState {
  deposits: {
    commitment: string;
    amount: string;
    timestamp: number;
    recipient: string;
    status: 'pending' | 'completed';
  }[];
  totalDeposited: string;
}

export function useMixer() {
  const [state, setState] = useState<MixerState>({
    deposits: [],
    totalDeposited: '0',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMixerState();
  }, []);

  const loadMixerState = async () => {
    try {
      setIsLoading(true);
      const storedDeposits = Object.entries(localStorage)
        .filter(([key]) => key.startsWith('mixer_'))
        .map(([_, value]) => JSON.parse(value as string));

      const chainId = process.env.NEXT_PUBLIC_CHAIN_ID || '11155111';
      const contractAddress = process.env.NEXT_PUBLIC_MIXER_CONTRACT_ADDRESS;

      if (contractAddress) {
        const response = await Moralis.EvmApi.events.getContractEvents({
          chain: chainId,
          address: contractAddress,
        });

        const events = response.result;
        if (events) {
          events.forEach(event => {
            if (event.data && event.data.commitment) {
              const commitment = event.data.commitment.toString();
              const storedDeposit = storedDeposits.find(d => d.commitment === commitment);
              if (storedDeposit) {
                storedDeposit.status = 'completed';
              }
            }
          });
        }
      }

      setState({
        deposits: storedDeposits,
        totalDeposited: (storedDeposits.reduce(
          (acc, curr) => acc + parseFloat(curr.amount),
          0
        ) * 0.001).toString(), // Adjust for new denomination
      });
    } catch (error) {
      console.error('Error loading mixer state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deposit = async (amount: string, recipientAddress: string) => {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    if (parseFloat(amount) !== 0.001) {
      throw new Error('Please deposit exactly 0.001 SepoliaETH');
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = getMixerContract(signer);

    // Generate commitment using recipient address and random value
    const randomValue = ethers.randomBytes(32);
    const commitment = ethers.keccak256(
      ethers.AbiCoder.defaultAbiCoder().encode(
        ['address', 'bytes32'],
        [recipientAddress, randomValue]
      )
    );

    // Store deposit data
    const depositData = {
      commitment,
      amount: '0.001',
      timestamp: Date.now(),
      recipient: recipientAddress,
      status: 'pending',
      randomValue: ethers.hexlify(randomValue),
    };

    localStorage.setItem(`mixer_${commitment}`, JSON.stringify(depositData));

    // Send transaction
    const tx = await contract.deposit(commitment, {
      value: ethers.parseEther('0.001'),
    });

    await tx.wait();

    // Update deposit status
    depositData.status = 'completed';
    localStorage.setItem(`mixer_${commitment}`, JSON.stringify(depositData));

    await loadMixerState();
    return commitment;
  };

  const withdraw = async (commitment: string) => {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    const depositData = JSON.parse(localStorage.getItem(`mixer_${commitment}`) || '{}');
    if (!depositData.randomValue || !depositData.recipient) {
      throw new Error('Invalid commitment or deposit data not found');
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = getMixerContract(signer);

    const nullifierHash = ethers.keccak256(
      ethers.AbiCoder.defaultAbiCoder().encode(
        ['bytes32', 'address'],
        [depositData.randomValue, depositData.recipient]
      )
    );

    const tx = await contract.withdraw(nullifierHash, depositData.recipient);
    await tx.wait();

    // Remove deposit data after successful withdrawal
    localStorage.removeItem(`mixer_${commitment}`);
    await loadMixerState();

    return nullifierHash;
  };

  return {
    state,
    isLoading,
    deposit,
    withdraw,
  };
}