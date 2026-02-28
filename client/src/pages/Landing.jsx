import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  ShoppingBag,
  Shield,
  Zap,
  CreditCard,
  Sparkle,
} from "lucide-react";

const Landing = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative">
      {/* ─── HERO SECTION ──────────────────────────────────── */}
      <section className="relative overflow-hidden before:absolute before:inset-1 before:h-[calc(100%-8rem)] before:rounded-2xl before:bg-muted sm:before:inset-2 md:before:rounded-[2rem] lg:before:h-[calc(100%-14rem)]">
        <div className="py-20 md:py-36">
          {/* Hero Text Content */}
          <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
            <div>
              {/* Badge Pill */}
              <Link
                to="/products"
                className="hover:bg-foreground/5 mx-auto flex w-fit items-center justify-center gap-2 rounded-md py-0.5 pl-1 pr-3 transition-colors duration-150"
              >
                <div
                  aria-hidden
                  className="border-background bg-gradient-to-b from-primary to-foreground relative flex size-5 items-center justify-center rounded border shadow-md shadow-black/20 ring-1 ring-black/10"
                >
                  <div className="absolute inset-x-0 inset-y-1.5 border-y border-dotted border-white/25"></div>
                  <div className="absolute inset-x-1.5 inset-y-0 border-x border-dotted border-white/25"></div>
                  <Sparkle className="size-3 fill-white stroke-white drop-shadow" />
                </div>
                <span className="font-medium">Built with MERN Stack</span>
              </Link>

              <h1 className="mx-auto mt-8 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Shop Smarter with{" "}
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  E-Commerce
                </span>
              </h1>

              <p className="text-muted-foreground mx-auto my-6 max-w-xl text-balance text-lg md:text-xl">
                A modern e-commerce experience powered by secure payments,
                real-time inventory, and a sleek interface designed for
                effortless shopping.
              </p>

              <div className="flex items-center justify-center gap-3">
                <Button asChild size="lg">
                  <Link to="/products">
                    <span className="text-nowrap">Browse Products</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                {!isAuthenticated && (
                  <Button asChild size="lg" variant="outline">
                    <Link to="/register">
                      <span className="text-nowrap">Create Account</span>
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Hero Image Preview */}
          <div className="relative">
            <div className="relative z-10 mx-auto max-w-5xl px-6">
              <div className="mt-12 md:mt-16">
                <div className="bg-background relative mx-auto overflow-hidden rounded-xl border border-transparent shadow-lg shadow-black/10 ring-1 ring-black/10">
                  <img
                    src="/hero-preview.png"
                    alt="E-Commerce Platform Preview"
                    className="w-full h-auto"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES SECTION ──────────────────────────────── */}
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

      {/* ─── CTA SECTION ──────────────────────────────── */}
      <section className="container mx-auto px-4 py-16">
        <div className="rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Shopping?</h2>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Browse our collection of products and experience seamless checkout
            with Stripe.
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
