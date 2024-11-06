"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Check } from "lucide-react";
import { ethers } from 'ethers';

const MIXER_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "commitment",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "uint32",
        "name": "leafIndex",
        "type": "uint32"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "Deposit",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "nullifierHash",
        "type": "bytes32"
      }
    ],
    "name": "Withdrawal",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_commitment",
        "type": "bytes32"
      }
    ],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_nullifierHash",
        "type": "bytes32"
      },
      {
        "internalType": "address payable",
        "name": "_recipient",
        "type": "address"
      }
    ],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const MIXER_BYTECODE = "0x608060405234801561001057600080fd5b50610559806100206000396000f3fe60806040526004361061002d5760003560e01c80632e1a7d4d14610038578063b214faa51461006857610034565b3661003457005b600080fd5b34801561004457600080fd5b50610052600480803590602001909190505061008c565b6040518082815260200191505060405180910390f35b61008a6004803603602081101561007e57600080fd5b81019080803590602001909291905050506100a8565b005b60006100a1826100a8565b9050919050565b600060608083806020019051810190808051906020019092919050505090508060008083815260200190815260200160002060006101000a81548160ff021916908315150217905550807f0c396cd989a39f4459b5fa1aed6a9a8dcdbc45908acfd67e028cd568da98982c6040518082815260200191505060405180910390a2505056fea26469706673582212207d7f5958f32c920fc0c2fc24b0cf690667c4c2531fab2c7b4a23bd290477654b64736f6c63430006060033";

export default function DeployPage() {
  const [isDeploying, setIsDeploying] = useState(false);
  const [contractAddress, setContractAddress] = useState('');
  const [error, setError] = useState('');

  const deployContract = async () => {
    if (!window.ethereum) {
      setError('Please install MetaMask to deploy the contract');
      return;
    }

    try {
      setIsDeploying(true);
      setError('');

      // Connect to MetaMask
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Deploy the contract
      const factory = new ethers.ContractFactory(MIXER_ABI, MIXER_BYTECODE, signer);
      const contract = await factory.deploy();
      await contract.deployed();

      setContractAddress(contract.address);
    } catch (err: any) {
      setError(err.message || 'Failed to deploy contract');
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#191724] text-[#e0def4] p-4">
      <div className="max-w-2xl mx-auto py-12">
        <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-[#eb6f92] to-[#31748f] text-transparent bg-clip-text">Deploy Mixer Contract</h1>

        <Card className="p-6 bg-[#1f1d2e] border-2 border-[#eb6f92] shadow-[0_0_15px_rgba(235,111,146,0.3)]">
          <div className="space-y-6">
            <p className="text-[#e0def4]">
              Deploy the CryptoMixer contract to Sepolia testnet using MetaMask.
              Make sure you have:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#908caa]">
              <li>MetaMask installed and connected to Sepolia</li>
              <li>Sufficient Sepolia ETH for deployment</li>
            </ul>

            <Button
              onClick={deployContract}
              disabled={isDeploying}
              className="w-full bg-gradient-to-r from-[#eb6f92] to-[#31748f] text-white hover:opacity-90"
            >
              {isDeploying ? 'Deploying...' : 'Deploy Contract'}
            </Button>

            {error && (
              <Alert variant="destructive" className="border-[#eb6f92] bg-[#26233a]">
                <AlertCircle className="h-4 w-4 text-[#eb6f92]" />
                <AlertTitle className="text-[#eb6f92]">Error</AlertTitle>
                <AlertDescription className="text-[#e0def4]">{error}</AlertDescription>
              </Alert>
            )}

            {contractAddress && (
              <Alert className="border-[#9ccfd8] bg-[#26233a]">
                <Check className="h-4 w-4 text-[#9ccfd8]" />
                <AlertTitle className="text-[#9ccfd8]">Success</AlertTitle>
                <AlertDescription className="mt-2">
                  <p className="text-[#e0def4]">Contract deployed at:</p>
                  <code className="font-mono mt-2 block break-all bg-[#1f1d2e] p-2 rounded text-[#e0def4]">
                    {contractAddress}
                  </code>
                  <p className="mt-2 text-[#908caa]">
                    ⚠️ Save this address! You'll need to add it to your .env file as NEXT_PUBLIC_MIXER_CONTRACT_ADDRESS
                  </p>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}