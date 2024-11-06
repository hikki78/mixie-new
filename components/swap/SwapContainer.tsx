"use client";

import { Suspense } from 'react';
import SwapForm from './SwapForm';
import Loading from '@/components/Loading';

export default function SwapContainer() {
  return (
    <div className="min-h-screen bg-[#191724] text-[#e0def4] p-4">
      <div className="max-w-2xl mx-auto py-12">
        <h1 className="text-4xl font-black mb-8 text-center bg-gradient-to-r from-[#eb6f92] to-[#31748f] text-transparent bg-clip-text">
          Swap Tokens
        </h1>
        <Suspense fallback={<Loading />}>
          <SwapForm />
        </Suspense>
      </div>
    </div>
  );
}