import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Star,
  ShoppingCart,
  ShoppingBag,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

// ─── HERO CAROUSEL DATA (5 ADS) ────────────────────────────────
const heroSlides = [
  {
    title: "Grab Upto 50% Off On Selected Headphones",
    cta: "Buy Now",
    bg: "bg-[#f0f0f0]",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop",
  },
  {
    title: "New Arrivals — Premium Sneakers Collection",
    cta: "Shop Now",
    bg: "bg-[#e8f5e9]",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop",
  },
  {
    title: "Smart Watch Sale — Up To 40% Off",
    cta: "Explore",
    bg: "bg-[#e3f2fd]",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop",
  },
  {
    title: "Best Deals On Fitness Equipment",
    cta: "Shop Deals",
    bg: "bg-[#fff3e0]",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&auto=format&fit=crop",
  },
  {
    title: "Summer Collection — Accessories & More",
    cta: "Discover",
    bg: "bg-[#fce4ec]",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop",
  },
];

const Landing = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/products?limit=8");
        setProducts(data.data.products);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Auto-rotate carousel
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 4000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <div className="min-h-screen">
      {/* ─── TOP ANNOUNCEMENT BAR ─────────────────────────────── */}
      <div className="bg-[#1b4332] text-white text-xs py-2 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Phone className="h-3 w-3" />
            <span>+001234567890</span>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <span>Get 50% Off on Selected Items</span>
            <span className="font-semibold">|</span>
            <Link to="/products" className="font-semibold hover:underline">
              Shop Now
            </Link>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span>Eng ▾</span>
            <span>Location ▾</span>
          </div>
        </div>
      </div>

      {/* ─── HERO CAROUSEL ────────────────────────────────────── */}
      <section className="container mx-auto px-4 py-6">
        <div className="relative overflow-hidden rounded-2xl">
          {/* Slides */}
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {heroSlides.map((slide, index) => (
              <div
                key={index}
                className={`w-full flex-shrink-0 ${slide.bg} rounded-2xl flex items-center justify-between p-8 md:p-12 min-h-[200px] md:min-h-[280px]`}
              >
                <div className="max-w-sm z-10">
                  <h2 className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight mb-6">
                    {slide.title}
                  </h2>
                  <Button asChild className="bg-[#1b4332] hover:bg-[#2d6a4f] text-white rounded-full px-8">
                    <Link to="/products">{slide.cta}</Link>
                  </Button>
                </div>
                <div className="hidden sm:block w-48 md:w-64 lg:w-80 flex-shrink-0">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-auto object-contain drop-shadow-xl"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentSlide ? "bg-[#1b4332] w-5" : "bg-gray-400/50"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRODUCTS SECTION ─────────────────────────────────── */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Products For You!</h2>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-8">
          <Button asChild variant="outline" size="lg" className="rounded-full px-8">
            <Link to="/products">
              View All Products
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────────────── */}
      <footer className="bg-[#1b4332] text-white mt-12">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag className="h-6 w-6" />
                <span className="text-xl font-bold">E-Commerce</span>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">
                Your one-stop shop for premium products. Quality items at unbeatable prices with secure payments.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><Link to="/products" className="hover:text-white transition-colors">All Products</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">My Account</Link></li>
                <li><Link to="/orders" className="hover:text-white transition-colors">My Orders</Link></li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li>Electronics</li>
                <li>Footwear</li>
                <li>Fitness</li>
                <li>Accessories</li>
                <li>Home</li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-3 text-sm text-white/70">
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  +001234567890
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  support@ecommerce.com
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  123 Commerce St, Business City
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-white/20 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/50">
            <p>© 2026 E-Commerce. All rights reserved.</p>
            <div className="flex gap-4">
              <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// ─── PRODUCT CARD COMPONENT ──────────────────────────────────
const ProductCard = ({ product }) => {
  return (
    <Card className="group overflow-hidden border hover:shadow-lg transition-all duration-300 bg-white">
      {/* Image */}
      <div className="relative aspect-square bg-zinc-50 p-4 overflow-hidden">
        <Link to={`/products/${product._id}`}>
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingBag className="h-16 w-16 text-muted-foreground/20" />
            </div>
          )}
        </Link>

        {/* Wishlist Heart */}
        <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
          <Heart className="h-4 w-4 text-gray-400 hover:text-red-500 transition-colors" />
        </button>

        {/* Low Stock Badge */}
        {product.stockQuantity > 0 && product.stockQuantity <= 10 && (
          <Badge className="absolute top-3 left-3 bg-orange-500 text-white text-[10px]">
            Only {product.stockQuantity} left
          </Badge>
        )}
        {product.stockQuantity === 0 && (
          <Badge className="absolute top-3 left-3 bg-red-500 text-white text-[10px]">
            Sold Out
          </Badge>
        )}
      </div>

      {/* Info */}
      <div className="p-3 space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <Link to={`/products/${product._id}`} className="hover:underline">
            <h3 className="font-semibold text-sm leading-tight line-clamp-1">
              {product.title}
            </h3>
          </Link>
          <span className="font-bold text-sm whitespace-nowrap">
            ${product.price.toFixed(2)}
          </span>
        </div>

        <p className="text-[11px] text-muted-foreground line-clamp-1 capitalize">
          {product.description || product.category}
        </p>

        {/* Stars */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          ))}
          <span className="text-[10px] text-muted-foreground ml-1">(121)</span>
        </div>

        {/* Add to Cart */}
        <Button
          asChild
          variant="outline"
          size="sm"
          className="w-full mt-1 text-xs h-8 rounded-full"
        >
          <Link to={`/products/${product._id}`}>
            <ShoppingCart className="h-3 w-3 mr-1.5" />
            Add to Cart
          </Link>
        </Button>
      </div>
    </Card>
  );
};

export default Landing;
