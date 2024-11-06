"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MoonIcon, SunIcon, Menu, X, Wallet, LogOut } from 'lucide-react';
import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [walletAddress, setWalletAddress] = useState('');

  useEffect(() => {
    setMounted(true);
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    }
  };

  const disconnectWallet = () => {
    setWalletAddress('');
  };

  if (!mounted) {
    return null;
  }

  return (
    <header className="border-b border-[#eb6f92]/20 bg-[#191724]/80 backdrop-blur-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" prefetch={false} className="flex items-center">
              <Wallet className="h-8 w-8 text-[#eb6f92]" />
              <span className="ml-2 text-xl font-bold text-[#e0def4]">Mixie</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/dashboard" prefetch={false} className="text-[#e0def4] hover:text-[#eb6f92] transition-colors">
              Dashboard
            </Link>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="mr-4 border-[#eb6f92] text-[#e0def4] hover:bg-[#eb6f92]/20"
            >
              {theme === 'dark' ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </Button>
            {walletAddress ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-[#eb6f92] text-[#e0def4] hover:bg-[#eb6f92]/20">
                    {`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-[#1f1d2e] border-[#eb6f92]">
                  <DropdownMenuItem onClick={disconnectWallet} className="text-[#e0def4] hover:bg-[#eb6f92]/20">
                    <LogOut className="mr-2 h-4 w-4" />
                    Disconnect Wallet
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={connectWallet} className="bg-[#eb6f92] text-white hover:bg-[#eb6f92]/90">
                Connect Wallet
              </Button>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-[#e0def4]"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-4">
              <Link href="/dashboard" prefetch={false} className="text-[#e0def4] hover:text-[#eb6f92] transition-colors">
                Dashboard
              </Link>
              {walletAddress ? (
                <Button variant="outline" onClick={disconnectWallet} className="w-full border-[#eb6f92] text-[#e0def4] hover:bg-[#eb6f92]/20">
                  <LogOut className="mr-2 h-4 w-4" />
                  Disconnect Wallet ({`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`})
                </Button>
              ) : (
                <Button onClick={connectWallet} className="w-full bg-[#eb6f92] text-white hover:bg-[#eb6f92]/90">
                  Connect Wallet
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="w-full border-[#eb6f92] text-[#e0def4] hover:bg-[#eb6f92]/20"
              >
                Toggle Theme
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}