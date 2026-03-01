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

// ─── SIMPLE ACCORDION COMPONENT ──────────────────────────────
const SimpleAccordion = ({ title, content, isOpen, onClick }) => (
  <div className="border-b border-gray-300/60 py-4">
    <button onClick={onClick} className="flex justify-between items-center w-full text-left font-bold text-gray-900 group">
      {title}
      <span className="text-2xl leading-none text-gray-600 font-normal group-hover:text-black">{isOpen ? "-" : "+"}</span>
    </button>
    {isOpen && (
      <div className="mt-3 text-sm text-gray-500 leading-relaxed font-medium">
        {content}
      </div>
    )}
  </div>
);

const Landing = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openAccordion, setOpenAccordion] = useState(2); // Unrivaled Variety open by default

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
                className={`w-full flex-shrink-0 ${slide.bg} rounded-2xl flex items-center justify-between px-6 md:px-10 h-[180px] md:h-[220px]`}
              >
                <div className="max-w-sm z-10">
                  <h2 className="text-xl md:text-3xl font-bold text-gray-900 leading-tight mb-4">
                    {slide.title}
                  </h2>
                  <Button asChild className="bg-[#1b4332] hover:bg-[#2d6a4f] text-white rounded-full px-6 h-9 text-sm">
                    <Link to="/products">{slide.cta}</Link>
                  </Button>
                </div>
                <div className="hidden sm:flex items-center justify-center w-40 md:w-52 lg:w-60 flex-shrink-0 h-full py-3">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="max-h-full w-auto object-contain drop-shadow-xl"
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

      {/* ─── TOP SELLING COLLECTION ───────────────────────────── */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <Badge variant="secondary" className="bg-gray-100 text-gray-700 rounded-full px-5 py-2 font-medium text-xs mb-6 border-none hover:bg-gray-200">
              See More product
            </Badge>
            <h2 className="text-4xl md:text-5xl lg:text-[56px] font-bold leading-[1.1] text-gray-900 tracking-tight">
              Top-Selling Product<br />of the year Collection
            </h2>
          </div>
          <div className="max-w-[18rem] text-left lg:text-left flex flex-col items-start lg:items-end gap-6 pb-2">
            <p className="text-[13px] text-gray-500 leading-relaxed font-medium">
              We do not divide our collections to seasons we create new models every week, and we in a few items
            </p>
            <Button variant="outline" className="rounded-full px-6 text-sm h-10 w-fit font-semibold border-gray-300">
              Shop Now
            </Button>
          </div>
        </div>

        {/* Masonry-like Grid for Top Selling */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 items-end">
          {/* Dress */}
          <div className="flex flex-col gap-4">
            <div className="bg-[#fcf4ec] hover:scale-[1.02] transition-transform duration-300 rounded-[2.5rem] overflow-hidden aspect-square flex items-center justify-center relative">
              <img src="/top-selling-dress.png" alt="Summer griles dress" className="w-full h-full object-cover p-2 rounded-[3rem]" />
            </div>
            <div className="flex justify-between items-start px-1">
              <div>
                <h3 className="font-semibold text-gray-900">Summer griles dress</h3>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1 font-medium">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  <span>(3.4)</span>
                </div>
              </div>
              <span className="font-bold text-gray-900">$150</span>
            </div>
          </div>

          {/* Sweater */}
          <div className="flex flex-col gap-4 md:-translate-y-12">
            <div className="bg-[#e2eaf4] hover:scale-[1.02] transition-transform duration-300 rounded-[2.5rem] overflow-hidden aspect-[3/4] flex items-center justify-center">
              <img src="/top-selling-sweater.png" alt="Summer Cloth" className="w-full h-full object-cover" />
            </div>
            <div className="flex justify-between items-start px-1">
              <div>
                <h3 className="font-semibold text-gray-900">Summer Cloth</h3>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1 font-medium">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  <span>(3.2)</span>
                </div>
              </div>
              <span className="font-bold text-gray-900">$120</span>
            </div>
          </div>

          {/* Water Bottle */}
          <div className="flex flex-col gap-4">
            <div className="bg-[#cddceb] hover:scale-[1.02] transition-transform duration-300 rounded-[2.5rem] overflow-hidden aspect-square flex items-center justify-center relative">
              <img src="/top-selling-bottle.png" alt="Water Bottle" className="w-full h-full object-cover" />
            </div>
            <div className="flex justify-between items-start px-1">
              <div>
                <h3 className="font-semibold text-gray-900">Water Bottle</h3>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1 font-medium">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  <span>(4.2)</span>
                </div>
              </div>
              <span className="font-bold text-gray-900">$67</span>
            </div>
          </div>

          {/* Cap */}
          <div className="flex flex-col gap-4 md:-translate-y-6">
            <div className="bg-[#244b6c] hover:scale-[1.02] transition-transform duration-300 rounded-[2.5rem] overflow-hidden aspect-square flex items-center justify-center relative">
              <img src="/top-selling-cap.png" alt="Cap" className="w-full h-full object-cover" />
              <button className="absolute bottom-5 right-5 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
              </button>
            </div>
            <div className="flex justify-between items-start px-1">
              <div>
                <h3 className="font-semibold text-gray-900">Cap</h3>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1 font-medium">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  <span>(4.2)</span>
                </div>
              </div>
              <span className="font-bold text-gray-900">$67</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── WHY CHOOSE US ─────────────────────────────────────── */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-4 lg:gap-6 items-stretch">
          <div className="bg-[#c2e4f0] rounded-[2.5rem] overflow-hidden min-h-[460px]">
            <img src="/why-choose-us.png" alt="Why Choose Us" className="w-full h-full object-cover" />
          </div>
          <div className="bg-[#f8f9fa] rounded-[2.5rem] p-8 md:p-14 lg:px-20 lg:py-16 flex flex-col justify-center">
            <h2 className="text-4xl md:text-[44px] tracking-tight font-bold text-gray-900 mb-5">Why Choose Us</h2>
            <p className="text-gray-500 text-[13px] font-medium leading-[1.8] mb-12 max-w-[26rem]">
              We pride ourselves on offering products that meet the highest standards of quality. Each item is carefully selected, tested, and crafted to ensure durability and customer satisfaction.
            </p>
            <div className="flex flex-col gap-1 w-full xl:w-[90%]">
              <SimpleAccordion 
                title="Unrivaled Quality" 
                content="We offer products crafted from premium materials, ensuring they stand the test of time and provide supreme comfort." 
                isOpen={openAccordion === 0} 
                onClick={() => setOpenAccordion(openAccordion === 0 ? null : 0)} 
              />
              <SimpleAccordion 
                title="Sustains business" 
                content="Our practices are environmentally conscious, promoting sustainable manufacturing and fair trade." 
                isOpen={openAccordion === 1} 
                onClick={() => setOpenAccordion(openAccordion === 1 ? null : 1)} 
              />
              <SimpleAccordion 
                title="Unrivaled Variety" 
                content="We believe in offering great value without compromising on quality or style. Our vast collection means there's something for everyone." 
                isOpen={openAccordion === 2} 
                onClick={() => setOpenAccordion(openAccordion === 2 ? null : 2)} 
              />
              <SimpleAccordion 
                title="Legacy Of Excellence" 
                content="For years we've maintained a standard of excellence that keeps our customers coming back time and time again." 
                isOpen={openAccordion === 3} 
                onClick={() => setOpenAccordion(openAccordion === 3 ? null : 3)} 
              />
            </div>
          </div>
        </div>
      </section>


      {/* ─── SERVICES TO HELP YOU SHOP ────────────────────────── */}
      <section className="container mx-auto px-4 py-10">
        <div className="border-t pt-10">
          <h2 className="text-xl font-bold mb-6">Services To Help You Shop</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* FAQ Card */}
            <div className="rounded-xl overflow-hidden bg-white border hover:shadow-md transition-shadow">
              <div className="p-5">
                <h3 className="font-bold text-lg mb-1">Frequently Asked Questions</h3>
                <p className="text-sm text-muted-foreground">Updates on safe Shopping in our Stores</p>
              </div>
              <div className="aspect-[4/3] overflow-hidden">
                <img src="/service-faq.png" alt="FAQ" className="w-full h-full object-cover" loading="lazy" />
              </div>
            </div>
            {/* Payment Card */}
            <div className="rounded-xl overflow-hidden bg-white border hover:shadow-md transition-shadow">
              <div className="p-5">
                <h3 className="font-bold text-lg mb-1">Online Payment Process</h3>
                <p className="text-sm text-muted-foreground">Updates on safe Shopping in our Stores</p>
              </div>
              <div className="aspect-[4/3] overflow-hidden">
                <img src="/service-payment.png" alt="Online Payment" className="w-full h-full object-cover" loading="lazy" />
              </div>
            </div>
            {/* Delivery Card */}
            <div className="rounded-xl overflow-hidden bg-white border hover:shadow-md transition-shadow">
              <div className="p-5">
                <h3 className="font-bold text-lg mb-1">Home Delivery Options</h3>
                <p className="text-sm text-muted-foreground">Updates on safe Shopping in our Stores</p>
              </div>
              <div className="aspect-[4/3] overflow-hidden">
                <img src="/service-delivery.png" alt="Home Delivery" className="w-full h-full object-cover" loading="lazy" />
              </div>
            </div>
          </div>
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
