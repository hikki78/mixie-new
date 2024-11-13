"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BeakerIcon } from "lucide-react";

export default function SwapPage() {
  return (
    <div className="min-h-screen bg-[#191724] text-[#e0def4] p-4">
      <div className="max-w-2xl mx-auto py-12">
        <h1 className="text-4xl font-black mb-8 text-center bg-gradient-to-r from-[#eb6f92] to-[#31748f] text-transparent bg-clip-text">
          Swap Tokens
        </h1>

        <Card className="p-8 bg-[#1f1d2e] border-2 border-[#eb6f92] shadow-[0_0_15px_rgba(235,111,146,0.3)] rounded-lg">
          <div className="text-center space-y-6">
            <BeakerIcon className="w-16 h-16 mx-auto text-[#eb6f92]" />
            <h2 className="text-2xl font-bold text-[#e0def4]">
              Experimental Feature
            </h2>
            <p className="text-[#908caa] max-w-md mx-auto">
              Token swapping is currently under development. This feature will
              allow you to seamlessly exchange different cryptocurrencies while
              maintaining privacy.
            </p>
            <div className="pt-4">
              <Button
                disabled
                className="bg-gradient-to-r from-[#eb6f92] to-[#31748f] text-white opacity-50 cursor-not-allowed"
              >
                Coming Soon
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
