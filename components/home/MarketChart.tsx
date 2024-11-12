"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  fetchMarketData,
  fetchExchangeRates,
  type MarketData,
} from "@/lib/coinapi";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const SYMBOLS = ["BTC", "ETH", "SOL"];
const TIME_PERIODS = [
  { id: "1DAY", label: "1D" },
  { id: "7DAY", label: "1W" },
  { id: "1MTH", label: "1M" },
];

interface ExchangeRate {
  asset_id_quote: string;
  rate: number;
}

export function MarketChart() {
  const [data, setData] = useState<MarketData[]>([]);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSymbol, setSelectedSymbol] = useState("BTC");
  const [selectedPeriod, setSelectedPeriod] = useState("1DAY");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch both market data and exchange rates
        const [marketData, ratesData] = await Promise.all([
          fetchMarketData(selectedSymbol, selectedPeriod),
          fetchExchangeRates(selectedSymbol),
        ]);

        setData(marketData);
        setExchangeRates(ratesData.rates?.slice(0, 5) || []);
      } catch (err: any) {
        console.error("Data fetching error:", err);
        setError(err.message || "Failed to load market data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedSymbol, selectedPeriod]);

  const formatData = (data: MarketData[]) => {
    return data.map((item) => ({
      date: new Date(item.time_period_start).toLocaleDateString(),
      price: item.price_close,
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="w-full max-w-4xl mx-auto mt-16"
    >
      <Card className="p-6 rounded-none border-4 border-black bg-white dark:bg-[#1f1d2e] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold dark:text-white">
              Market Overview
            </h3>
            <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <TabsList className="bg-gray-100 dark:bg-[#26233a]">
                {TIME_PERIODS.map((period) => (
                  <TabsTrigger
                    key={period.id}
                    value={period.id}
                    className="data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-[#eb6f92]"
                  >
                    {period.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <div className="flex gap-2">
            {SYMBOLS.map((symbol) => (
              <button
                key={symbol}
                onClick={() => setSelectedSymbol(symbol)}
                className={`px-4 py-2 rounded-none border-2 border-black dark:border-[#eb6f92] ${
                  selectedSymbol === symbol
                    ? "bg-black text-white dark:bg-[#eb6f92]"
                    : "bg-white text-black hover:bg-gray-100 dark:bg-[#26233a] dark:text-white dark:hover:bg-[#eb6f92]/20"
                }`}
              >
                {symbol}
              </button>
            ))}
          </div>

          {exchangeRates.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 py-2">
              {exchangeRates.map((rate) => (
                <div
                  key={rate.asset_id_quote}
                  className="p-2 border-2 border-black dark:border-[#eb6f92] text-center bg-white dark:bg-[#26233a]"
                >
                  <div className="text-sm font-bold dark:text-[#e0def4]">
                    {rate.asset_id_quote}
                  </div>
                  <div className="text-sm dark:text-[#e0def4]">
                    ${rate.rate.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="h-[300px] w-full">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400 dark:text-[#e0def4]" />
              </div>
            ) : error ? (
              <div className="h-full flex items-center justify-center text-red-500 dark:text-[#eb6f92]">
                {error}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formatData(data)}>
                  <XAxis
                    dataKey="date"
                    stroke="currentColor"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    className="dark:text-[#e0def4]"
                  />
                  <YAxis
                    stroke="currentColor"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                    className="dark:text-[#e0def4]"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "2px solid black",
                      borderRadius: "0",
                      padding: "8px",
                    }}
                    formatter={(value: any) => [
                      `$${value.toLocaleString()}`,
                      "Price",
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#FF3366"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
