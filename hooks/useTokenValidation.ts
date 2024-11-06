"use client";

import { ethers } from 'ethers';

export interface TokenConfig {
  symbol: string;
  address: string;
  decimals: number;
  networks: {
    [key: string]: {
      address: string;
      symbol?: string;
    }
  };
}

// Token configurations for both mainnet and testnet
export const TOKENS: Record<string, TokenConfig> = {
  ETH: {
    symbol: 'ETH',
    address: 'ETH',
    decimals: 18,
    networks: {
      '1': { address: 'ETH' },
      '11155111': { address: 'ETH', symbol: 'SepoliaETH' }
    }
  },
  USDC: {
    symbol: 'USDC',
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    decimals: 6,
    networks: {
      '1': { address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' },
      '11155111': { address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238' }
    }
  },
  USDT: {
    symbol: 'USDT',
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    decimals: 6,
    networks: {
      '1': { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7' },
      '11155111': { address: '0x7169D38820dfd117C3FA1f22a697dBA58d90BA06' }
    }
  },
  DAI: {
    symbol: 'DAI',
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    decimals: 18,
    networks: {
      '1': { address: '0x6B175474E89094C44Da98b954EedeAC495271d0F' },
      '11155111': { address: '0x3e622317f8C93f7328350cF0B56d9eD4C620C5d6' }
    }
  },
  WBTC: {
    symbol: 'WBTC',
    address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    decimals: 8,
    networks: {
      '1': { address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599' },
      '11155111': { address: '0x29f2D40B0605204364af54EC677bD022dA425d03' }
    }
  }
};

export function useTokenValidation() {
  const validateAmount = (amount: string): string | null => {
    if (!amount || amount.trim() === '') {
      return 'Amount is required';
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return 'Please enter a valid amount greater than 0';
    }
    if (numAmount < 0.000001) {
      return 'Amount must be at least 0.000001';
    }
    return null;
  };

  const getCurrentNetwork = (): string => {
    return process.env.NEXT_PUBLIC_CHAIN_ID || '11155111';
  };

  const getTokenDecimals = (symbol: string): number => {
    return TOKENS[symbol]?.decimals || 18;
  };

  const getTokenAddress = (symbol: string): string => {
    const network = getCurrentNetwork();
    const token = TOKENS[symbol];
    if (!token) return '';
    
    return token.networks[network]?.address || token.address;
  };

  const getTokenSymbol = (symbol: string): string => {
    const network = getCurrentNetwork();
    const token = TOKENS[symbol];
    if (!token) return symbol;
    
    return token.networks[network]?.symbol || token.symbol;
  };

  const formatTokenAmount = (amount: string, symbol: string): string => {
    try {
      const decimals = getTokenDecimals(symbol);
      return ethers.parseUnits(amount, decimals).toString();
    } catch (error) {
      throw new Error('Invalid amount format');
    }
  };

  const formatDisplayAmount = (amount: string, decimals: number): string => {
    try {
      return ethers.formatUnits(amount, decimals);
    } catch (error) {
      return '0';
    }
  };

  return {
    validateAmount,
    getTokenDecimals,
    getTokenAddress,
    getTokenSymbol,
    formatTokenAmount,
    formatDisplayAmount,
    getCurrentNetwork,
    TOKENS,
  };
}