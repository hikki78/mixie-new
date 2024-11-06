import { ethers } from 'ethers';

const ZRX_API_URL = 'https://api.0x.org';
const ZEROX_API_KEY = process.env.NEXT_PUBLIC_0X_API_KEY;

interface QuoteParams {
  sellToken: string;
  buyToken: string;
  sellAmount: string;
  takerAddress: string;
}

interface QuoteResponse {
  price: string;
  guaranteedPrice: string;
  to: string;
  data: string;
  value: string;
  buyAmount: string;
  estimatedGas: number;
  sellAmount: string;
  allowanceTarget?: string;
}

export async function fetchQuote({
  sellToken,
  buyToken,
  sellAmount,
  takerAddress,
}: QuoteParams): Promise<QuoteResponse> {
  if (!ZEROX_API_KEY) {
    throw new Error('0x API key is not configured. Please add NEXT_PUBLIC_0X_API_KEY to your environment variables.');
  }

  const params = new URLSearchParams({
    sellToken: sellToken === 'ETH' ? 'ETH' : sellToken,
    buyToken: buyToken === 'ETH' ? 'ETH' : buyToken,
    sellAmount,
    takerAddress,
    slippagePercentage: '0.01',
  });

  const response = await fetch(`${ZRX_API_URL}/swap/v1/quote?${params}`, {
    headers: {
      '0x-api-key': ZEROX_API_KEY,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.reason || 'Failed to get quote from 0x API');
  }

  const data = await response.json();
  return data;
}