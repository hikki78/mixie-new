"use client";

import { useState, useEffect } from 'react';
import { Moralis } from '@/lib/moralis';

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

export function useMixerState() {
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
        ) * 0.001).toString(),
      });
    } catch (error) {
      console.error('Error loading mixer state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    state,
    isLoading,
  };
}