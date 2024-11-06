import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface StatsProps {
  totalDeposited: string;
  totalWithdrawn: string;
}

export default function DashboardStats({ totalDeposited, totalWithdrawn }: StatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6 bg-[#1f1d2e] border-2 border-[#eb6f92] shadow-[0_0_15px_rgba(235,111,146,0.3)]">
          <h2 className="text-lg font-semibold mb-2 text-[#e0def4]">Total Mixed</h2>
          <p className="text-3xl font-bold text-[#eb6f92]">{totalDeposited} ETH</p>
        </Card>
      </motion.div>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6 bg-[#1f1d2e] border-2 border-[#31748f] shadow-[0_0_15px_rgba(49,116,143,0.3)]">
          <h2 className="text-lg font-semibold mb-2 text-[#e0def4]">Total Withdrawn</h2>
          <p className="text-3xl font-bold text-[#31748f]">{totalWithdrawn} ETH</p>
        </Card>
      </motion.div>
    </div>
  );
}