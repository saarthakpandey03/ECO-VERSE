import { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProductGrid } from "@/components/ProductGrid";
import { Cart, CartItem } from "@/components/Cart";
import { ProductModal } from "@/components/ProductModal";
import { Product } from "@/components/ProductCard";
import { useToast } from "@/hooks/use-toast";
import smartphoneImg from "@/assets/smartphone.jpg";
import headphonesImg from "@/assets/headphones.jpg";
import laptopImg from "@/assets/laptop.jpg";
import smartwatchImg from "@/assets/smartwatch.jpg";

const Index = () => {
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sample product data
  const products: Product[] = [
    {
      id: "1",
      name: "Latest Smartphone Pro Max",
      price: 899.99,
      originalPrice: 1099.99,
      rating: 4.8,
      reviews: 1247,
      image: smartphoneImg,
      badge: "Best Seller"
    },
    {
      id: "2",
      name: "Premium Wireless Headphones",
      price: 299.99,
      originalPrice: 399.99,
      rating: 4.6,
      reviews: 892,
      image: headphonesImg,
      badge: "Popular"
    },
    {
      id: "3",
      name: "Gaming Laptop Ultra Performance",
      price: 1599.99,
      originalPrice: 1899.99,
      rating: 4.9,
      reviews: 543,
      image: laptopImg,
      badge: "New"
    },
    {
      id: "4",
      name: "Smart Fitness Watch",
      price: 249.99,
      rating: 4.5,
      reviews: 756,
      image: smartwatchImg
    },
    // Duplicate products for demo
    {
      id: "5",
      name: "Smartphone Lite Version",
      price: 599.99,
      originalPrice: 699.99,
      rating: 4.4,
      reviews: 432,
      image: smartphoneImg
    },
    {
      id: "6",
      name: "Studio Quality Headphones",
      price: 449.99,
      rating: 4.7,
      reviews: 298,
      image: headphonesImg,
      badge: "Pro"
    }
  ];

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      setCartItems(items =>
        items.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCartItems(items => [...items, { ...product, quantity }]);
    }

    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      handleRemoveItem(id);
      return;
    }
    
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart.",
    });
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header 
        cartCount={totalItems}
        onCartClick={() => setIsCartOpen(true)}
      />
      
      <main>
        <Hero />
        
        <section className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Featured Products</h2>
            <p className="text-muted-foreground">Discover our most popular items with amazing deals</p>
          </div>
          
          <ProductGrid
            products={products}
            onAddToCart={handleAddToCart}
            onProductClick={handleProductClick}
          />
        </section>

        {/* Promotional Section */}
        <section className="bg-muted/50 py-12">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Why Choose ShopEase?</h2>
            <div className="grid md:grid-cols-3 gap-8 mt-8">
              <div className="space-y-2">
                <div className="text-4xl">🚚</div>
                <h3 className="font-semibold">Free Shipping</h3>
                <p className="text-muted-foreground">Free delivery on orders over $50</p>
              </div>
              <div className="space-y-2">
                <div className="text-4xl">🔒</div>
                <h3 className="font-semibold">Secure Payment</h3>
                <p className="text-muted-foreground">Your payment information is safe</p>
              </div>
              <div className="space-y-2">
                <div className="text-4xl">↩️</div>
                <h3 className="font-semibold">Easy Returns</h3>
                <p className="text-muted-foreground">30-day return policy</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};

export default Index;
