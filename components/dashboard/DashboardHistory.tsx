"use client";

import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";
import { useMixerState } from '@/hooks/useMixerState';

export default function DashboardHistory() {
  const { state, isLoading } = useMixerState();

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="p-6 mb-8 bg-[#1f1d2e] border-2 border-[#eb6f92] shadow-[0_0_15px_rgba(235,111,146,0.3)]">
        <h2 className="text-xl font-semibold mb-4 text-[#e0def4]">Mixing History</h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[#eb6f92]/20">
                <TableHead className="text-[#e0def4]">Commitment</TableHead>
                <TableHead className="text-[#e0def4]">Date</TableHead>
                <TableHead className="text-[#e0def4]">Amount (ETH)</TableHead>
                <TableHead className="text-[#e0def4]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-[#e0def4]">
                    Loading history...
                  </TableCell>
                </TableRow>
              ) : state.deposits.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-[#e0def4]">
                    No mixing history found
                  </TableCell>
                </TableRow>
              ) : (
                state.deposits.map((deposit) => (
                  <TableRow key={deposit.commitment} className="border-b border-[#eb6f92]/20">
                    <TableCell className="font-mono text-[#e0def4]">
                      {`${deposit.commitment.slice(0, 6)}...${deposit.commitment.slice(-4)}`}
                    </TableCell>
                    <TableCell className="text-[#e0def4]">
                      {new Date(deposit.timestamp).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-[#e0def4]">{deposit.amount}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          deposit.status === 'completed'
                            ? 'bg-[#9ccfd8]/20 text-[#9ccfd8]'
                            : 'bg-[#f6c177]/20 text-[#f6c177]'
                        }`}
                      >
                        {deposit.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </motion.div>
  );
}