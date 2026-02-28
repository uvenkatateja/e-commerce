import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "../context/AuthContext";
import {
  ArrowRight,
  ArrowUp,
  Globe,
  Plus,
  Sparkle,
  Sparkles,
} from "lucide-react";

const Landing = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative">
      {/* ─── HERO SECTION ──────────────────────────────────── */}
      <section className="relative overflow-hidden before:absolute before:inset-1 before:h-[calc(100%-8rem)] before:rounded-2xl before:bg-muted sm:before:inset-2 md:before:rounded-[2rem] lg:before:h-[calc(100%-14rem)]">
        <div className="py-20 md:py-36">
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

      {/* ─── FEATURES SECTION (AI Card Style) ──────────────── */}
      <section>
        <div className="py-24">
          <div className="mx-auto w-full max-w-3xl px-6">
            <h2 className="text-foreground text-balance text-3xl font-semibold md:text-4xl">
              <span className="text-muted-foreground">Empowering your shopping with</span>{" "}
              seamless e-commerce solutions
            </h2>

            <div className="mt-12 space-y-12">
              {/* Feature Card with Background Image */}
              <Card className="relative overflow-hidden p-0">
                <img
                  src="https://images.unsplash.com/photo-1635776062043-223faf322554?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt=""
                  className="absolute inset-0 size-full object-cover"
                />
                <div className="m-auto max-w-md p-4 sm:p-12">
                  <AIAssistantIllustration />
                </div>
              </Card>

              {/* Feature Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-medium">Secure Payments</h3>
                  <p className="text-muted-foreground">
                    Powered by Stripe with real payment processing and webhook
                    verification for safe transactions.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-medium">Real-time Inventory</h3>
                  <p className="text-muted-foreground">
                    Stock deduction happens only after successful payment,
                    preventing overselling and ensuring accuracy.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-medium">Admin Dashboard</h3>
                  <p className="text-muted-foreground">
                    Full product management, sales analytics, and low stock
                    alerts — all in one professional interface.
                  </p>
                </div>
              </div>
            </div>
          </div>
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

// ─── AI ASSISTANT ILLUSTRATION COMPONENT ─────────────────
const AIAssistantIllustration = () => {
  return (
    <Card aria-hidden className="relative space-y-4 p-6">
      <div className="w-fit">
        <Sparkles className="size-3.5 fill-purple-300 stroke-purple-300" />
        <p className="mt-2 line-clamp-2 text-sm">
          How can I optimize my e-commerce store for the best customer
          experience?
        </p>
        <ul role="list" className="text-muted-foreground mt-3 space-y-2 text-sm">
          {[
            { value: "5+", emoji: "⭐️", label: "Product Categories" },
            { value: "100%", emoji: "🔒", label: "Secure Checkout" },
            { value: "24/7", emoji: "🛒", label: "Online Ordering" },
          ].map((stat, index) => (
            <li key={index} className="-ml-0.5 flex items-center gap-2">
              <span>{stat.emoji}</span>
              <span className="text-foreground font-medium">{stat.value}</span>{" "}
              {stat.label}
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-foreground/5 -mx-3 -mb-3 space-y-3 rounded-lg p-3">
        <div className="text-muted-foreground text-sm">Ask AI Assistant</div>
        <div className="flex justify-between">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="size-7 rounded-2xl bg-transparent shadow-none"
            >
              <Plus />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-7 rounded-2xl bg-transparent shadow-none"
            >
              <Globe />
            </Button>
          </div>
          <Button size="icon" className="size-7 rounded-2xl bg-black">
            <ArrowUp strokeWidth={3} />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default Landing;
