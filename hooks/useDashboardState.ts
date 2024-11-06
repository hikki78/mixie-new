"use client";

import { useState, useEffect } from 'react';

export interface Deposit {
  commitment: string;
  amount: string;
  timestamp: number;
  recipient: string;
  status: 'pending' | 'completed';
}

export interface Swap {
  hash: string;
  timestamp: number;
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
  status: 'completed';
}

export interface DashboardState {
  deposits: Deposit[];
  withdrawals: Deposit[];
  swaps: Swap[];
  totalDeposited: string;
  totalWithdrawn: string;
}

export function useDashboardState() {
  const [state, setState] = useState<DashboardState>({
    deposits: [],
    withdrawals: [],
    swaps: [],
    totalDeposited: '0',
    totalWithdrawn: '0',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardState();
  }, []);

  const loadDashboardState = async () => {
    try {
      setIsLoading(true);
      
      // Load deposits and withdrawals
      const storedDeposits = Object.entries(localStorage)
        .filter(([key]) => key.startsWith('mixer_'))
        .map(([_, value]) => JSON.parse(value as string));

      const completedDeposits = storedDeposits.filter(d => d.status === 'completed');
      const withdrawals = storedDeposits.filter(d => d.withdrawn);

      // Load swaps
      const swaps = Object.entries(localStorage)
        .filter(([key]) => key.startsWith('swap_'))
        .map(([_, value]) => JSON.parse(value as string))
        .sort((a, b) => b.timestamp - a.timestamp);

      setState({
        deposits: storedDeposits,
        withdrawals,
        swaps,
        totalDeposited: completedDeposits.reduce(
          (acc, curr) => acc + parseFloat(curr.amount),
          0
        ).toString(),
        totalWithdrawn: withdrawals.reduce(
          (acc, curr) => acc + parseFloat(curr.amount),
          0
        ).toString(),
      });
    } catch (error) {
      console.error('Error loading dashboard state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    state,
    isLoading,
    refresh: loadDashboardState,
  };
}