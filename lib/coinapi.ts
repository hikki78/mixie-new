export const COINAPI_KEY = process.env.NEXT_PUBLIC_COINAPI_KEY;
export const COINAPI_BASE_URL = 'https://rest.coinapi.io/v1';

export interface MarketData {
  time_period_start: string;
  time_period_end: string;
  time_open: string;
  time_close: string;
  price_open: number;
  price_high: number;
  price_low: number;
  price_close: number;
  volume_traded: number;
  trades_count: number;
}

export async function fetchMarketData(symbol: string = 'BTC', period: string = '1DAY', limit: number = 30): Promise<MarketData[]> {
  if (!COINAPI_KEY) {
    throw new Error('CoinAPI key is not configured');
  }

  const response = await fetch(
    `${COINAPI_BASE_URL}/ohlcv/BITSTAMP_SPOT_${symbol}_USD/history?period_id=${period}&limit=${limit}`,
    {
      headers: {
        'X-CoinAPI-Key': COINAPI_KEY
      }
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch market data');
  }

  const data = await response.json();
  return data;
}

export async function fetchExchangeRates(baseSymbol: string = 'BTC'): Promise<any> {
  if (!COINAPI_KEY) {
    throw new Error('CoinAPI key is not configured');
  }

  const response = await fetch(
    `${COINAPI_BASE_URL}/exchangerate/${baseSymbol}`,
    {
      headers: {
        'X-CoinAPI-Key': COINAPI_KEY
      }
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch exchange rates');
  }

  return response.json();
}