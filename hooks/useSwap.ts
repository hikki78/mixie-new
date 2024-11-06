"use client";

import { useState } from 'react';
import { ethers } from 'ethers';
import { useTokenValidation } from './useTokenValidation';
import { fetchQuote } from '@/lib/swapService';

export interface SwapQuote {
  expectedOutput: string;
  minimumReceived: string;
  priceImpact: string;
  tx: {
    to: string;
    data: string;
    value: string;
    gasLimit?: number;
  };
}

export function useSwap() {
  const [isLoading, setIsLoading] = useState(false);
  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const { validateAmount, getTokenAddress, getTokenDecimals } = useTokenValidation();

  const getQuote = async (
    sellToken: string,
    buyToken: string,
    sellAmount: string
  ): Promise<SwapQuote> => {
    try {
      setIsLoading(true);
      
      const amountError = validateAmount(sellAmount);
      if (amountError) {
        throw new Error(amountError);
      }

      if (!window.ethereum) {
        throw new Error('Please install MetaMask to perform swaps');
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const userAddress = accounts[0];

      const sellTokenAddress = getTokenAddress(sellToken);
      const buyTokenAddress = getTokenAddress(buyToken);
      const sellTokenDecimals = getTokenDecimals(sellToken);
      const buyTokenDecimals = getTokenDecimals(buyToken);

      if (!sellTokenAddress || !buyTokenAddress) {
        throw new Error('Invalid token configuration');
      }

      const amount = ethers.parseUnits(sellAmount, sellTokenDecimals).toString();

      const quoteData = await fetchQuote({
        sellToken: sellTokenAddress,
        buyToken: buyTokenAddress,
        sellAmount: amount,
        takerAddress: userAddress,
      });

      const quote: SwapQuote = {
        expectedOutput: ethers.formatUnits(quoteData.buyAmount, buyTokenDecimals),
        minimumReceived: ethers.formatUnits(quoteData.guaranteedPrice, buyTokenDecimals),
        priceImpact: ((1 - Number(quoteData.guaranteedPrice) / Number(quoteData.price)) * 100).toFixed(2),
        tx: {
          to: quoteData.to,
          data: quoteData.data,
          value: quoteData.value || '0',
          gasLimit: Math.ceil(quoteData.estimatedGas * 1.5),
        },
      };

      setQuote(quote);
      return quote;
    } catch (error: any) {
      console.error('Quote error:', error);
      throw new Error(error.message || 'Failed to get swap quote');
    } finally {
      setIsLoading(false);
    }
  };

  const executeSwap = async (quoteData: SwapQuote): Promise<string> => {
    if (!window.ethereum) {
      throw new Error('Please install MetaMask to perform swaps');
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const tx = await signer.sendTransaction({
        to: quoteData.tx.to,
        data: quoteData.tx.data,
        value: quoteData.tx.value,
        gasLimit: quoteData.tx.gasLimit,
      });

      const receipt = await tx.wait();
      
      const swapHistory = {
        hash: receipt.transactionHash,
        timestamp: Date.now(),
        expectedOutput: quoteData.expectedOutput,
        minimumReceived: quoteData.minimumReceived,
        status: 'completed'
      };
      
      localStorage.setItem(`swap_${receipt.transactionHash}`, JSON.stringify(swapHistory));
      
      return receipt.transactionHash;
    } catch (error: any) {
      console.error('Swap error:', error);
      throw new Error(error.message || 'Swap execution failed');
    }
  };

  return {
    isLoading,
    quote,
    getQuote,
    executeSwap,
  };
}