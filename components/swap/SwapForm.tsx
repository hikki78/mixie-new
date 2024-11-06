"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowDownUp, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSwap } from '@/hooks/useSwap';
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useTokenValidation } from '@/hooks/useTokenValidation';
import { SwapQuote } from '@/hooks/useSwap';
import { SwapDetails } from './SwapDetails';

export default function SwapForm() {
  const [sellToken, setSellToken] = useState('ETH');
  const [buyToken, setBuyToken] = useState('USDC');
  const [sellAmount, setSellAmount] = useState('');
  const [error, setError] = useState('');
  const { isLoading, quote, getQuote, executeSwap } = useSwap();
  const { toast } = useToast();
  const { TOKENS, getTokenSymbol } = useTokenValidation();

  useEffect(() => {
    const fetchQuote = async () => {
      if (!sellAmount || Number(sellAmount) <= 0 || sellToken === buyToken) {
        return;
      }

      try {
        setError('');
        await getQuote(sellToken, buyToken, sellAmount);
      } catch (err: any) {
        setError(err.message);
      }
    };

    const debounceTimeout = setTimeout(fetchQuote, 500);
    return () => clearTimeout(debounceTimeout);
  }, [sellAmount, sellToken, buyToken, getQuote]);

  const handleSwap = async () => {
    if (!quote) return;

    try {
      setError('');
      const txHash = await executeSwap(quote);
      toast({
        title: "Swap successful",
        description: `Transaction hash: ${txHash.slice(0, 10)}...${txHash.slice(-8)}`,
      });

      setSellAmount('');
    } catch (err: any) {
      setError(err.message || 'Failed to execute swap');
    }
  };

  const switchTokens = () => {
    const tempToken = sellToken;
    setSellToken(buyToken);
    setBuyToken(tempToken);
    setSellAmount('');
  };

  return (
    <motion.div
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Card className="p-8 bg-[#1f1d2e] border-2 border-[#eb6f92] shadow-[0_0_15px_rgba(235,111,146,0.3)] rounded-lg backdrop-blur-sm">
        <div className="space-y-6">
          <motion.div className="space-y-2" layout>
            <Label className="text-[#e0def4]">You Pay</Label>
            <div className="flex gap-4">
              <Select value={sellToken} onValueChange={setSellToken}>
                <SelectTrigger className="w-[120px] border-[#eb6f92] bg-[#26233a] text-[#e0def4]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#26233a] border-[#eb6f92]">
                  {Object.keys(TOKENS).map((token) => (
                    <SelectItem 
                      key={token} 
                      value={token} 
                      className="text-[#e0def4] hover:bg-[#eb6f92]/20"
                      disabled={token === buyToken}
                    >
                      {getTokenSymbol(token)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                value={sellAmount}
                onChange={(e) => setSellAmount(e.target.value)}
                placeholder="0.0"
                min="0"
                step="0.000001"
                className="border-[#eb6f92] bg-[#26233a] text-[#e0def4] placeholder:text-[#6e6a86]"
              />
            </div>
          </motion.div>

          <div className="flex justify-center">
            <motion.div whileHover={{ rotate: 180 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="outline"
                size="icon"
                onClick={switchTokens}
                className="rounded-full border-2 border-[#eb6f92] bg-[#26233a] hover:bg-[#eb6f92]/20"
              >
                <ArrowDownUp className="h-4 w-4 text-[#eb6f92]" />
              </Button>
            </motion.div>
          </div>

          <motion.div className="space-y-2" layout>
            <Label className="text-[#e0def4]">You Receive</Label>
            <div className="flex gap-4">
              <Select value={buyToken} onValueChange={setBuyToken}>
                <SelectTrigger className="w-[120px] border-[#eb6f92] bg-[#26233a] text-[#e0def4]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#26233a] border-[#eb6f92]">
                  {Object.keys(TOKENS).map((token) => (
                    <SelectItem 
                      key={token} 
                      value={token} 
                      className="text-[#e0def4] hover:bg-[#eb6f92]/20"
                      disabled={token === sellToken}
                    >
                      {getTokenSymbol(token)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="text"
                value={quote ? quote.expectedOutput : ''}
                readOnly
                placeholder="0.0"
                className="border-[#eb6f92] bg-[#26233a] text-[#e0def4]"
              />
            </div>
          </motion.div>

          {quote && <SwapDetails quote={quote} buyToken={buyToken} />}

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Alert variant="destructive" className="bg-[#26233a] border-[#eb6f92]">
                  <AlertCircle className="h-4 w-4 text-[#eb6f92]" />
                  <AlertTitle className="text-[#eb6f92]">Error</AlertTitle>
                  <AlertDescription className="text-[#e0def4]">{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              className="w-full bg-gradient-to-r from-[#eb6f92] to-[#31748f] text-white hover:opacity-90 relative overflow-hidden group"
              onClick={handleSwap}
              disabled={isLoading || !quote || !sellAmount || sellToken === buyToken}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Swap Tokens
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
}