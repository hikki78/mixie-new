"use client";

import { Suspense } from "react";
import DashboardStats from "./DashboardStats";
import DashboardHistory from "./DashboardHistory";
import Loading from "@/components/Loading";
import { motion } from "framer-motion";
import { useDashboardState } from "@/hooks/useDashboardState";

export default function DashboardContainer() {
  const { state, isLoading } = useDashboardState();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-[#191724] text-[#e0def4] p-4">
      <div className="max-w-7xl mx-auto py-8">
        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-4xl font-bold mb-8 bg-gradient-to-r from-[#eb6f92] to-[#31748f] text-transparent bg-clip-text"
        >
          Dashboard
        </motion.h1>

        <Suspense fallback={<Loading />}>
          <DashboardStats
            totalDeposited={state.totalDeposited}
            totalWithdrawn={state.totalWithdrawn}
          />
          <DashboardHistory />
        </Suspense>
      </div>
    </div>
  );
}
