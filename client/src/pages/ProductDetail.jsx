import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  ShoppingCart,
  Star,
  Minus,
  Plus,
  Truck,
  RotateCcw,
  Heart,
  Share2,
  Package,
  Phone,
  ShoppingBag,
  Mail,
  MapPin,
} from "lucide-react";

// Color swatches (decorative since our products don't have color variants)
const colorOptions = [
  { name: "Red", class: "bg-red-400" },
  { name: "Charcoal", class: "bg-zinc-700" },
  { name: "Green", class: "bg-emerald-400" },
  { name: "Silver", class: "bg-zinc-300" },
  { name: "Navy", class: "bg-blue-800" },
];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data.data);
      } catch (error) {
        toast.error("Product not found");
        navigate("/products");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to purchase");
      navigate("/login");
      return;
    }

    setBuying(true);
    try {
      const { data } = await api.post("/orders/checkout", {
        items: [{ productId: product._id, quantity }],
      });
      window.location.href = data.data.url;
    } catch (error) {
      toast.error(error.response?.data?.message || "Checkout failed");
      setBuying(false);
    }
  };

  if (loading) {
    return (
      <div>
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
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-10">
            <Skeleton className="aspect-square rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const isOutOfStock = product.stockQuantity === 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 10;
  const monthlyPrice = (product.price / 6).toFixed(2);

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
            <Link to="/products" className="font-semibold hover:underline">Shop Now</Link>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span>Eng ▾</span>
            <span>Location ▾</span>
          </div>
        </div>
      </div>

      {/* ─── BREADCRUMB ───────────────────────────────────────── */}
      <div className="container mx-auto px-4 py-4">
        <nav className="text-sm text-muted-foreground">
          <span className="hover:text-foreground cursor-pointer">
            <Link to="/products" className="hover:underline">{product.category || "Products"}</Link>
          </span>
          <span className="mx-2">/</span>
          <span className="hover:text-foreground cursor-pointer">
            <Link to="/products" className="hover:underline">Shop</Link>
          </span>
          <span className="mx-2">/</span>
          <span className="text-foreground font-medium">{product.title}</span>
        </nav>
      </div>

      {/* ─── PRODUCT DETAIL ───────────────────────────────────── */}
      <div className="container mx-auto px-4 pb-12">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* LEFT: Product Image */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-zinc-50 rounded-xl overflow-hidden aspect-square flex items-center justify-center p-8 border">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <Package className="h-24 w-24 text-muted-foreground/20" />
              )}
            </div>

            {/* Thumbnail Gallery (4 views of the same product) */}
            <div className="flex gap-3">
              {[0, 1, 2, 3].map((i) => (
                <button
                  key={i}
                  className={`w-20 h-20 rounded-lg border-2 overflow-hidden bg-zinc-50 p-2 flex items-center justify-center transition-all ${
                    i === 0 ? "border-[#1b4332]" : "border-transparent hover:border-zinc-300"
                  }`}
                >
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={`${product.title} view ${i + 1}`}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <Package className="h-6 w-6 text-muted-foreground/30" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: Product Info */}
          <div className="space-y-5">
            {/* Title */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {product.title}
              </h1>
              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Star Rating */}
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-sm text-muted-foreground ml-1">(121)</span>
            </div>

            {/* Price */}
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
                <span className="text-sm text-muted-foreground">
                  or {monthlyPrice}/month
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Suggested payments with 6 months special financing
              </p>
            </div>

            <Separator />

            {/* Choose a Color */}
            <div>
              <h3 className="font-semibold text-sm mb-3">Choose a Color</h3>
              <div className="flex gap-2">
                {colorOptions.map((color, i) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(i)}
                    className={`w-9 h-9 rounded-full ${color.class} transition-all ${
                      selectedColor === i
                        ? "ring-2 ring-offset-2 ring-[#1b4332]"
                        : "hover:ring-1 hover:ring-offset-1 hover:ring-zinc-400"
                    }`}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <Separator />

            {/* Quantity Selector + Stock Warning */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center border rounded-full overflow-hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full text-red-500 hover:bg-red-50"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 font-semibold text-lg min-w-[2.5rem] text-center">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full text-green-600 hover:bg-green-50"
                  onClick={() =>
                    setQuantity((q) => Math.min(product.stockQuantity, q + 1))
                  }
                  disabled={quantity >= product.stockQuantity || isOutOfStock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {isOutOfStock ? (
                <span className="text-sm text-red-600 font-medium">
                  Out of Stock
                </span>
              ) : (
                <div className="text-sm">
                  <span>
                    Only <span className="text-[#1b4332] font-bold">{product.stockQuantity} Items</span> Left!
                  </span>
                  <p className="text-muted-foreground text-xs">Don't miss it</p>
                </div>
              )}
            </div>

            {/* Buy Now + Add to Cart */}
            <div className="flex gap-3">
              <Button
                size="lg"
                onClick={handleBuyNow}
                disabled={buying || isOutOfStock}
                className="flex-1 bg-[#1b4332] hover:bg-[#2d6a4f] text-white rounded-full h-12 text-base font-semibold"
              >
                {buying ? "Redirecting..." : "Buy Now"}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleBuyNow}
                disabled={buying || isOutOfStock}
                className="flex-1 rounded-full h-12 text-base font-semibold border-[#1b4332] text-[#1b4332] hover:bg-[#1b4332]/5"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </div>

            {/* Action Icons */}
            <div className="flex gap-4 pt-1">
              <button
                onClick={() => setLiked(!liked)}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-red-500 transition-colors"
              >
                <Heart className={`h-4 w-4 ${liked ? "fill-red-500 text-red-500" : ""}`} />
                Wishlist
              </button>
              <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Share2 className="h-4 w-4" />
                Share
              </button>
            </div>

            {/* Delivery Info Cards */}
            <div className="space-y-0 border rounded-xl overflow-hidden">
              <div className="p-4 flex items-start gap-3">
                <Truck className="h-5 w-5 text-[#1b4332] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Free Delivery</p>
                  <p className="text-xs text-muted-foreground">
                    Enter your Postal code for Delivery Availability
                  </p>
                </div>
              </div>
              <Separator />
              <div className="p-4 flex items-start gap-3">
                <RotateCcw className="h-5 w-5 text-[#1b4332] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Return Delivery</p>
                  <p className="text-xs text-muted-foreground">
                    Free 30days Delivery Returns.{" "}
                    <span className="underline cursor-pointer">Details</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── FOOTER ───────────────────────────────────────────── */}
      <footer className="bg-[#1b4332] text-white mt-8">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag className="h-6 w-6" />
                <span className="text-xl font-bold">E-Commerce</span>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">
                Your one-stop shop for premium products. Quality items at unbeatable prices with secure payments.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><Link to="/products" className="hover:text-white transition-colors">All Products</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">My Account</Link></li>
                <li><Link to="/orders" className="hover:text-white transition-colors">My Orders</Link></li>
              </ul>
            </div>
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
            <div>
              <h4 className="font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-3 text-sm text-white/70">
                <li className="flex items-center gap-2"><Phone className="h-4 w-4 flex-shrink-0" /> +001234567890</li>
                <li className="flex items-center gap-2"><Mail className="h-4 w-4 flex-shrink-0" /> support@ecommerce.com</li>
                <li className="flex items-start gap-2"><MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" /> 123 Commerce St, Business City</li>
              </ul>
            </div>
          </div>
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

export default ProductDetail;
