"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Copy, Sparkles } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { ethers } from 'ethers';
import { useMixerOperations } from '@/hooks/useMixerOperations';

export default function MixForm() {
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [commitment, setCommitment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [lastCommitment, setLastCommitment] = useState('');

  const { deposit, withdraw } = useMixerOperations();
  const { toast } = useToast();

  const validateAmount = (value: string) => {
    const numAmount = parseFloat(value);
    if (isNaN(numAmount) || numAmount < 0.001) {
      return 'Amount must be at least 0.001 ETH';
    }
    return null;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: "The commitment ID has been copied to your clipboard.",
      });
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleMix = async () => {
    if (!recipientAddress || !amount) return;

    const amountError = validateAmount(amount);
    if (amountError) {
      setError(amountError);
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      setLastCommitment('');

      if (!window.ethereum) {
        throw new Error('Please install MetaMask to use this feature');
      }

      if (!ethers.isAddress(recipientAddress)) {
        throw new Error('Invalid recipient address');
      }

      setSuccess('Transaction submitted. Waiting for confirmation...');
      
      const newCommitment = await deposit(amount, recipientAddress);
      setLastCommitment(newCommitment);
      
      setSuccess('Transaction confirmed! Your funds have been mixed. Please save your commitment ID to withdraw later.');
      setRecipientAddress('');
      setAmount('');
    } catch (err: any) {
      console.error('Mixing error:', err);
      setError(err.message || 'An error occurred while mixing funds');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!commitment) return;

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      await withdraw(commitment);
      setSuccess('Withdrawal successful!');
      setCommitment('');
    } catch (err: any) {
      console.error('Withdrawal error:', err);
      setError(err.message || 'An error occurred while withdrawing funds');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Card className="p-8 bg-[#1f1d2e] border-2 border-[#eb6f92] shadow-[0_0_15px_rgba(235,111,146,0.3)] rounded-lg backdrop-blur-sm">
        <Tabs defaultValue="deposit" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-[#26233a]">
            <TabsTrigger value="deposit" className="data-[state=active]:bg-[#eb6f92] data-[state=active]:text-white">
              Deposit & Mix
            </TabsTrigger>
            <TabsTrigger value="withdraw" className="data-[state=active]:bg-[#eb6f92] data-[state=active]:text-white">
              Withdraw
            </TabsTrigger>
          </TabsList>

          <TabsContent value="deposit">
            <div className="space-y-6">
              <Alert className="bg-[#26233a] border-[#9ccfd8]">
                <AlertTitle className="text-[#9ccfd8]">Minimum Amount</AlertTitle>
                <AlertDescription className="text-[#e0def4]">
                  Minimum mixing amount is 0.001 SepoliaETH. You can mix any amount above this.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label className="text-[#e0def4]">Amount (ETH)</Label>
                <Input
                  type="number"
                  placeholder="Enter amount (min. 0.001)"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0.001"
                  step="0.001"
                  className="border-[#eb6f92] bg-[#26233a] text-[#e0def4] placeholder:text-[#6e6a86]"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[#e0def4]">Recipient Address</Label>
                <Input
                  type="text"
                  placeholder="Enter recipient address"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  className="border-[#eb6f92] bg-[#26233a] text-[#e0def4] placeholder:text-[#6e6a86]"
                />
              </div>

              {lastCommitment && (
                <Alert className="bg-[#26233a] border-[#9ccfd8]">
                  <AlertTitle className="flex items-center justify-between text-[#9ccfd8]">
                    Your Commitment ID
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(lastCommitment)}
                      className="text-[#9ccfd8] hover:text-[#eb6f92]"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </AlertTitle>
                  <AlertDescription className="mt-2 font-mono break-all text-[#e0def4]">
                    {lastCommitment}
                  </AlertDescription>
                  <AlertDescription className="mt-2 text-sm text-[#908caa]">
                    ⚠️ Save this ID! You'll need it to withdraw your funds later.
                  </AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive" className="bg-[#26233a] border-[#eb6f92]">
                  <AlertCircle className="h-4 w-4 text-[#eb6f92]" />
                  <AlertTitle className="text-[#eb6f92]">Error</AlertTitle>
                  <AlertDescription className="text-[#e0def4]">{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-[#26233a] border-[#9ccfd8]">
                  <Sparkles className="h-4 w-4 text-[#9ccfd8]" />
                  <AlertTitle className="text-[#9ccfd8]">Success</AlertTitle>
                  <AlertDescription className="text-[#e0def4]">{success}</AlertDescription>
                </Alert>
              )}

              <Button 
                className="w-full bg-gradient-to-r from-[#eb6f92] to-[#31748f] text-white hover:opacity-90"
                onClick={handleMix}
                disabled={loading || !recipientAddress || !amount}
              >
                {loading ? 'Processing...' : `Mix ${amount || '0.000'} SepoliaETH`}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="withdraw">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[#e0def4]">Commitment ID</Label>
                <Input
                  type="text"
                  placeholder="Enter your commitment ID"
                  value={commitment}
                  onChange={(e) => setCommitment(e.target.value)}
                  className="border-[#eb6f92] bg-[#26233a] text-[#e0def4] placeholder:text-[#6e6a86]"
                />
              </div>

              {error && (
                <Alert variant="destructive" className="bg-[#26233a] border-[#eb6f92]">
                  <AlertCircle className="h-4 w-4 text-[#eb6f92]" />
                  <AlertTitle className="text-[#eb6f92]">Error</AlertTitle>
                  <AlertDescription className="text-[#e0def4]">{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-[#26233a] border-[#9ccfd8]">
                  <Sparkles className="h-4 w-4 text-[#9ccfd8]" />
                  <AlertTitle className="text-[#9ccfd8]">Success</AlertTitle>
                  <AlertDescription className="text-[#e0def4]">{success}</AlertDescription>
                </Alert>
              )}

              <Button 
                className="w-full bg-gradient-to-r from-[#eb6f92] to-[#31748f] text-white hover:opacity-90"
                onClick={handleWithdraw}
                disabled={loading || !commitment}
              >
                {loading ? 'Processing...' : 'Withdraw Funds'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </motion.div>
  );
}