"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowDownUp, AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TOKENS = {
  ETH: { symbol: 'SepoliaETH', decimals: 18 },
  USDC: { symbol: 'USDC', decimals: 6 },
  USDT: { symbol: 'USDT', decimals: 6 },
  DAI: { symbol: 'DAI', decimals: 18 },
};

export default function SwapPage() {
  const [sellToken, setSellToken] = useState('ETH');
  const [buyToken, setBuyToken] = useState('USDC');
  const [sellAmount, setSellAmount] = useState('');
  const [estimatedAmount, setEstimatedAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSwap = async () => {
    if (!window.ethereum) {
      setError('Please install MetaMask to perform swaps');
      return;
    }

    try {
      setError('');
      setIsLoading(true);

      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Simple mock swap for demonstration
      setTimeout(() => {
        setIsLoading(false);
        setError('Swapping is temporarily disabled for maintenance.');
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to perform swap');
      setIsLoading(false);
    }
  };

  const switchTokens = () => {
    const tempToken = sellToken;
    setSellToken(buyToken);
    setBuyToken(tempToken);
    setSellAmount('');
    setEstimatedAmount('');
  };

  const updateEstimatedAmount = (amount: string) => {
    setSellAmount(amount);
    // Mock price calculation
    if (amount && !isNaN(Number(amount))) {
      const mockPrice = 1800; // Mock ETH/USD price
      setEstimatedAmount((Number(amount) * mockPrice).toString());
    } else {
      setEstimatedAmount('');
    }
  };

  return (
    <div className="min-h-screen bg-[#191724] text-[#e0def4] p-4">
      <div className="max-w-2xl mx-auto py-12">
        <h1 className="text-4xl font-black mb-8 text-center bg-gradient-to-r from-[#eb6f92] to-[#31748f] text-transparent bg-clip-text">
          Swap Tokens
        </h1>

        <Card className="p-8 bg-[#1f1d2e] border-2 border-[#eb6f92] shadow-[0_0_15px_rgba(235,111,146,0.3)] rounded-lg">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[#e0def4]">You Pay</Label>
              <div className="flex gap-4">
                <Select value={sellToken} onValueChange={setSellToken}>
                  <SelectTrigger className="w-[120px] border-[#eb6f92] bg-[#26233a] text-[#e0def4]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#26233a] border-[#eb6f92]">
                    {Object.entries(TOKENS).map(([token, { symbol }]) => (
                      <SelectItem 
                        key={token} 
                        value={token}
                        className="text-[#e0def4] hover:bg-[#eb6f92]/20"
                        disabled={token === buyToken}
                      >
                        {symbol}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  value={sellAmount}
                  onChange={(e) => updateEstimatedAmount(e.target.value)}
                  placeholder="0.0"
                  min="0"
                  step="0.000001"
                  className="border-[#eb6f92] bg-[#26233a] text-[#e0def4] placeholder:text-[#6e6a86]"
                />
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                variant="outline"
                size="icon"
                onClick={switchTokens}
                className="rounded-full border-2 border-[#eb6f92] bg-[#26233a] hover:bg-[#eb6f92]/20"
              >
                <ArrowDownUp className="h-4 w-4 text-[#eb6f92]" />
              </Button>
            </div>

            <div className="space-y-2">
              <Label className="text-[#e0def4]">You Receive</Label>
              <div className="flex gap-4">
                <Select value={buyToken} onValueChange={setBuyToken}>
                  <SelectTrigger className="w-[120px] border-[#eb6f92] bg-[#26233a] text-[#e0def4]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#26233a] border-[#eb6f92]">
                    {Object.entries(TOKENS).map(([token, { symbol }]) => (
                      <SelectItem 
                        key={token} 
                        value={token}
                        className="text-[#e0def4] hover:bg-[#eb6f92]/20"
                        disabled={token === sellToken}
                      >
                        {symbol}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="text"
                  value={estimatedAmount}
                  readOnly
                  placeholder="0.0"
                  className="border-[#eb6f92] bg-[#26233a] text-[#e0def4]"
                />
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="bg-[#26233a] border-[#eb6f92]">
                <AlertCircle className="h-4 w-4 text-[#eb6f92]" />
                <AlertTitle className="text-[#eb6f92]">Error</AlertTitle>
                <AlertDescription className="text-[#e0def4]">{error}</AlertDescription>
              </Alert>
            )}

            <Button
              className="w-full bg-gradient-to-r from-[#eb6f92] to-[#31748f] text-white hover:opacity-90"
              onClick={handleSwap}
              disabled={isLoading || !sellAmount || sellToken === buyToken}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                'Swap Tokens'
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}