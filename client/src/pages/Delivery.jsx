import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Truck,
  Clock,
  Shield,
  MapPin,
  Package,
  RotateCcw,
  Phone,
  Mail,
  ShoppingBag,
  CheckCircle,
} from "lucide-react";

const deliveryFeatures = [
  {
    icon: Truck,
    title: "Free Standard Delivery",
    description: "Enjoy free shipping on all orders over $50. Standard delivery takes 5-7 business days.",
    color: "text-[#1b4332]",
    bg: "bg-green-50",
  },
  {
    icon: Clock,
    title: "Express Delivery",
    description: "Need it fast? Get your order delivered in 1-2 business days with our express option.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: MapPin,
    title: "Track Your Order",
    description: "Real-time tracking available for all orders. Know exactly where your package is at all times.",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: Shield,
    title: "Secure Packaging",
    description: "All products are securely packaged to ensure they arrive in perfect condition.",
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "Not satisfied? Return any product within 30 days for a full refund. No questions asked.",
    color: "text-red-600",
    bg: "bg-red-50",
  },
  {
    icon: Package,
    title: "Nationwide Coverage",
    description: "We deliver to every corner of the country. No location is too far for us.",
    color: "text-cyan-600",
    bg: "bg-cyan-50",
  },
];

const deliverySteps = [
  { step: "1", title: "Place Order", desc: "Add items to cart and checkout securely" },
  { step: "2", title: "Processing", desc: "We prepare and package your order carefully" },
  { step: "3", title: "Shipped", desc: "Your package is on its way with tracking" },
  { step: "4", title: "Delivered", desc: "Receive your order at your doorstep" },
];

const Delivery = () => {
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
      <section className="bg-gradient-to-r from-[#1b4332] to-[#40916c] text-white">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="flex items-center gap-3 mb-4">
            <Truck className="h-8 w-8" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-3">
            Delivery Information
          </h1>
          <p className="text-white/80 text-lg max-w-xl">
            Fast, reliable, and secure delivery to your doorstep. We make sure your products arrive safely and on time.
          </p>
        </div>
      </section>

      {/* Delivery Features */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8 text-center">Our Delivery Promise</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {deliveryFeatures.map((feature, i) => (
            <Card key={i} className="border hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-zinc-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {deliverySteps.map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 rounded-full bg-[#1b4332] text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
        <div className="max-w-2xl mx-auto space-y-4">
          {[
            { q: "How long does standard delivery take?", a: "Standard delivery takes 5-7 business days from the date of purchase." },
            { q: "Is there a minimum order for free delivery?", a: "Yes, free standard delivery is available on all orders over $50." },
            { q: "Can I track my order?", a: "Absolutely! Once your order is shipped, you'll receive a tracking email with real-time updates." },
            { q: "What is your return policy?", a: "We offer a hassle-free 30-day return policy. Simply contact our support team to initiate a return." },
          ].map((faq, i) => (
            <Card key={i} className="border">
              <CardContent className="pt-5 pb-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-[#1b4332] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm mb-1">{faq.q}</h4>
                    <p className="text-sm text-muted-foreground">{faq.a}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button asChild size="lg" className="rounded-full px-8 bg-[#1b4332] hover:bg-[#2d6a4f]">
            <Link to="/products">Start Shopping</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1b4332] text-white">
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

export default Delivery;
