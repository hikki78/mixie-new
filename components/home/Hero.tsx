import { Button } from "@/components/ui/button";
import { ArrowRight, Repeat, Sparkles } from "lucide-react";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { MarketChart } from "./MarketChart";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32 bg-[#FFDE00]">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8">
          <div className="inline-flex items-center rounded-none px-3 py-1 text-sm font-bold bg-black text-[#FFDE00] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Sparkles className="mr-1 h-3 w-3" /> Next Generation Mixer
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-black">
            Welcome to Mixie
            <span className="block mt-2">Privacy Made Simple</span>
          </h1>

          <div className="max-w-4xl mx-auto">
            <Carousel
              opts={{
                align: "center",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                <CarouselItem className="md:basis-1/2">
                  <div className="p-6">
                    <div className="rounded-none border-4 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <h3 className="text-xl font-bold text-black mb-2">
                        Secure Mixing
                      </h3>
                      <p className="text-gray-600">
                        Advanced encryption for your transactions
                      </p>
                    </div>
                  </div>
                </CarouselItem>
                <CarouselItem className="md:basis-1/2">
                  <div className="p-6">
                    <div className="rounded-none border-4 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <h3 className="text-xl font-bold text-black mb-2">
                        Fast Processing
                      </h3>
                      <p className="text-gray-600">
                        Lightning-quick mixing and swaps
                      </p>
                    </div>
                  </div>
                </CarouselItem>
                <CarouselItem className="md:basis-1/2">
                  <div className="p-6">
                    <div className="rounded-none border-4 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <h3 className="text-xl font-bold text-black mb-2">
                        Complete Privacy
                      </h3>
                      <p className="text-gray-600">
                        Your transactions, your business
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
          </div>

          <div className="flex justify-center gap-4">
            <Link href="/mix" prefetch={false}>
              <Button
                size="lg"
                className="text-lg px-8 rounded-none border-4 border-black bg-[#FF3366] text-white hover:bg-[#FF3366]/90 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                Start Mixing
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              disabled
              className="text-lg px-8 rounded-none border-4 border-black bg-white text-black opacity-50 cursor-not-allowed shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              Swap Tokens
              <Repeat className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <MarketChart />
        </div>
      </div>
    </section>
  );
}
