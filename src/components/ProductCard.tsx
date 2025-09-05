import { Star, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
}

export const ProductCard = ({ product, onAddToCart, onProductClick }: ProductCardProps) => {
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
      <CardContent className="p-0">
        {/* Image Container */}
        <div className="relative overflow-hidden" onClick={() => onProductClick(product)}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.badge && (
            <span className="absolute top-2 left-2 bg-accent text-accent-foreground text-xs font-semibold px-2 py-1 rounded">
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
              -{discount}%
            </span>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-2">
          <h3 
            className="font-semibold text-sm text-foreground line-clamp-2 hover:text-primary transition-colors"
            onClick={() => onProductClick(product)}
          >
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center space-x-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(product.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">({product.reviews})</span>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-primary">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <Button
            size="sm"
            className="w-full mt-2 bg-accent hover:bg-accent/90 text-accent-foreground"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};