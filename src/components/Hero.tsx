import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

export const Hero = () => {
  return (
    <section className="bg-gradient-to-r from-primary to-primary-light text-primary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Discover Amazing Deals
          </h1>
          <p className="text-xl md:text-2xl opacity-90">
            Shop the latest products with unbeatable prices and fast delivery
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button 
              size="lg" 
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-3"
            >
              Shop Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary px-8 py-3"
            >
              View Deals
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};