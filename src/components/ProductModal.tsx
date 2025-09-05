import { X, Star, Plus, Minus } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Product } from "./ProductCard";
import { useState } from "react";

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const ProductModal = ({ product, isOpen, onClose, onAddToCart }: ProductModalProps) => {
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardContent className="p-0">
          <div className="flex justify-end p-4">
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 p-6 pt-0">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-96 object-cover rounded-lg"
                />
                {product.badge && (
                  <span className="absolute top-4 left-4 bg-accent text-accent-foreground text-sm font-semibold px-3 py-1 rounded">
                    {product.badge}
                  </span>
                )}
                {discount > 0 && (
                  <span className="absolute top-4 right-4 bg-red-500 text-white text-sm font-semibold px-3 py-1 rounded">
                    -{discount}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-4">{product.name}</h1>
                
                {/* Rating */}
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-medium">{product.rating}</span>
                  <span className="text-muted-foreground">({product.reviews} reviews)</span>
                </div>

                {/* Price */}
                <div className="flex items-center space-x-3 mb-6">
                  <span className="text-4xl font-bold text-primary">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xl text-muted-foreground line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Key Features:</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Premium quality materials</li>
                  <li>• Fast and reliable performance</li>
                  <li>• 1-year warranty included</li>
                  <li>• Free shipping on orders over $50</li>
                </ul>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="font-medium">Quantity:</span>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-10 w-10 p-0"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center text-lg">{quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-10 w-10 p-0"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button
                    size="lg"
                    className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                    onClick={() => {
                      onAddToCart(product, quantity);
                      onClose();
                    }}
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Add to Cart
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="flex-1"
                  >
                    Buy Now
                  </Button>
                </div>
              </div>

              {/* Additional Info */}
              <div className="text-sm text-muted-foreground space-y-1">
                <p>✓ Free shipping on orders over $50</p>
                <p>✓ 30-day return policy</p>
                <p>✓ Secure payment processing</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};