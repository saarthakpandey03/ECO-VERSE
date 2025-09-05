import { Search, ShoppingCart, User, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
}

export const Header = ({ cartCount, onCartClick }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="bg-primary text-primary-foreground shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="lg:hidden text-primary-foreground hover:bg-primary-light">
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">ShopEase</h1>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8 hidden md:block">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search products..."
                className="w-full pl-4 pr-12 py-2 bg-white text-foreground border-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                size="sm" 
                className="absolute right-0 top-0 h-full px-4 bg-accent hover:bg-accent/90"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Navigation Icons */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="hidden lg:flex text-primary-foreground hover:bg-primary-light">
              <User className="h-5 w-5 mr-2" />
              Account
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative text-primary-foreground hover:bg-primary-light"
              onClick={onCartClick}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                  {cartCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full pl-4 pr-12 py-2 bg-white text-foreground"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button size="sm" className="absolute right-0 top-0 h-full px-4 bg-accent hover:bg-accent/90">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Categories */}
      <div className="bg-primary-light">
        <div className="container mx-auto px-4">
          <nav className="flex space-x-6 py-2 overflow-x-auto">
            {["Electronics", "Fashion", "Home & Garden", "Sports", "Books", "Health"].map((category) => (
              <Button
                key={category}
                variant="ghost"
                size="sm"
                className="text-primary-foreground hover:bg-primary whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};