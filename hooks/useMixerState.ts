"use client";

import { useState, useEffect } from "react";

export interface MixerState {
  deposits: {
    commitment: string;
    amount: string;
    timestamp: number;
    recipient: string;
    status: "pending" | "completed";
  }[];
  totalDeposited: string;
}

export function useMixerState() {
  const [state, setState] = useState<MixerState>({
    deposits: [],
    totalDeposited: "0",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMixerState();
  }, []);

  const loadMixerState = async () => {
    try {
      setIsLoading(true);

      // Load deposits from local storage
      const storedDeposits = Object.entries(localStorage)
        .filter(([key]) => key.startsWith("mixer_"))
        .map(([_, value]) => JSON.parse(value as string))
        .sort((a, b) => b.timestamp - a.timestamp); // Sort by most recent first

      setState({
        deposits: storedDeposits,
        totalDeposited: storedDeposits
          .reduce((acc, curr) => acc + parseFloat(curr.amount), 0)
          .toString(),
      });
    } catch (error) {
      console.error("Error loading mixer state:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    state,
    isLoading,
    refresh: loadMixerState, // Expose refresh function to manually update state
  };
}
