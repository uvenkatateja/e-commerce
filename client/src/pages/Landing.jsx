import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "../context/AuthContext";
import { ArrowRight, ShoppingBag, Shield, Zap, CreditCard } from "lucide-react";

const Landing = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

        <div className="relative container mx-auto px-4 py-24 md:py-36">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Badge variant="secondary" className="px-4 py-1 text-sm">
              🚀 Built with MERN Stack
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
              Shop Smarter with{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                E-Commerce Shop
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              A modern e-commerce experience powered by secure payments,
              real-time inventory, and a sleek interface designed for
              effortless shopping.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button size="lg" asChild className="px-8">
                <Link to="/products">
                  Browse Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              {!isAuthenticated && (
                <Button variant="outline" size="lg" asChild className="px-8">
                  <Link to="/register">Create Account</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Why Choose Us?</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Built with security, performance, and user experience at its core.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: CreditCard,
              title: "Secure Payments",
              desc: "Powered by Stripe with real payment processing and webhook verification.",
            },
            {
              icon: Shield,
              title: "Enterprise Security",
              desc: "JWT authentication, bcrypt hashing, rate limiting, and helmet protection.",
            },
            {
              icon: Zap,
              title: "Blazing Fast",
              desc: "MongoDB indexes, lean queries, debounced search, and optimized React rendering.",
            },
            {
              icon: ShoppingBag,
              title: "Great UX",
              desc: "Responsive design, real-time stock updates, and intuitive navigation.",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="group p-6 rounded-xl border bg-card hover:bg-accent/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Shopping?</h2>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Browse our collection of products and experience seamless checkout with Stripe.
          </p>
          <Button size="lg" asChild>
            <Link to="/products">
              Explore Products <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Landing;
