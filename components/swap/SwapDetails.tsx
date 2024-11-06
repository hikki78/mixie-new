import { motion } from "framer-motion";
import { useTokenValidation } from '@/hooks/useTokenValidation';
import type { SwapQuote } from '@/hooks/useSwap';

interface SwapDetailsProps {
  quote: SwapQuote;
  buyToken: string;
}

export function SwapDetails({ quote, buyToken }: SwapDetailsProps) {
  const { getTokenSymbol } = useTokenValidation();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 bg-[#26233a] rounded-lg border border-[#eb6f92]/20"
    >
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-[#908caa]">Minimum received</span>
          <span className="text-[#e0def4]">
            {quote.minimumReceived} {getTokenSymbol(buyToken)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#908caa]">Price Impact</span>
          <span className={`text-${parseFloat(quote.priceImpact) > 2 ? '[#eb6f92]' : '[#9ccfd8]'}`}>
            {quote.priceImpact}%
          </span>
        </div>
      </div>
    </motion.div>
  );
}