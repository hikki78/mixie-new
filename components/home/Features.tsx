import { Shield, Lock, RefreshCw, Repeat } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: <Shield className="h-12 w-12 mb-4 text-primary" />,
    title: "Secure Mixing",
    description: "State-of-the-art encryption protocols",
  },
  {
    icon: <Lock className="h-12 w-12 mb-4 text-primary" />,
    title: "Complete Privacy",
    description: "Untraceable transactions",
  },
  {
    icon: <RefreshCw className="h-12 w-12 mb-4 text-primary" />,
    title: "Fast Processing",
    description: "Lightning-quick mixing",
  },
  {
    icon: <Repeat className="h-12 w-12 mb-4 text-primary" />,
    title: "Token Swaps",
    description: "Instant token exchanges",
  },
];

export function Features() {
  return (
    <section className="py-20 relative bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index}>
              <Card className="p-6 h-full rounded-none border-4 border-black hover:translate-x-1 hover:translate-y-1 transition-transform shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex flex-col items-center text-center h-full">
                  {feature.icon}
                  <h3 className="text-xl font-black mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground font-medium">{feature.description}</p>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}