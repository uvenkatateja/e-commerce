import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  ArrowRight,
  ShoppingBag,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

const WhatsNew = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/products?sort=newest&limit=12");
        setProducts(data.data.products);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Announcement Bar */}
      <div className="bg-[#1b4332] text-white text-xs py-2 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Phone className="h-3 w-3" />
            <span>+001234567890</span>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <span>Get 50% Off on Selected Items</span>
            <span className="font-semibold">|</span>
            <Link to="/products" className="font-semibold hover:underline">Shop Now</Link>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span>Eng ▾</span>
            <span>Location ▾</span>
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-yellow-300" />
            <Badge className="bg-white text-indigo-700 font-bold text-sm px-3 py-1">
              NEW ARRIVALS
            </Badge>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-3">
            What's New
          </h1>
          <p className="text-white/80 text-lg max-w-xl mb-4">
            Be the first to explore our latest additions. Fresh products added to our collection just for you.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Latest Arrivals</h2>
          <span className="text-sm text-muted-foreground">{products.length} products</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <Button asChild variant="outline" size="lg" className="rounded-full px-8">
            <Link to="/products">
              View All Products
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1b4332] text-white mt-8">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag className="h-6 w-6" />
                <span className="text-xl font-bold">E-Commerce</span>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">
                Your one-stop shop for premium products at unbeatable prices.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><Link to="/products" className="hover:text-white transition-colors">All Products</Link></li>
                <li><Link to="/deals" className="hover:text-white transition-colors">Deals</Link></li>
                <li><Link to="/whats-new" className="hover:text-white transition-colors">What's New</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li>Electronics</li><li>Footwear</li><li>Fitness</li><li>Accessories</li><li>Home</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-3 text-sm text-white/70">
                <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +001234567890</li>
                <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> support@ecommerce.com</li>
                <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5" /> 123 Commerce St, Business City</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-6 text-sm text-white/50 text-center">
            <p>© 2026 E-Commerce. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WhatsNew;
