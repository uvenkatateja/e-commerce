import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  Tag,
  Warehouse,
  Users,
  Megaphone,
  Settings,
  ShoppingBag,
  Search,
  Bell,
  Mail,
  ShoppingCart,
  BarChart3,
} from "lucide-react";

const sidebarLinks = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Categories", href: "/admin/products", icon: Tag },
  { name: "Inventory", href: "/admin/products", icon: Warehouse },
  { name: "Customers", href: "/admin/dashboard", icon: Users },
  { name: "Marketing", href: "/admin/dashboard", icon: Megaphone },
  { name: "Settings", href: "/admin/dashboard", icon: Settings },
];

const topTabs = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Orders", href: "/admin/dashboard", icon: ShoppingCart },
  { name: "Analytics", href: "/admin/dashboard", icon: BarChart3 },
  { name: "Inventory", href: "/admin/products", icon: Warehouse },
  { name: "Settings", href: "/admin/dashboard", icon: Settings },
];

const AdminLayout = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (href, name) => {
    if (name === "Products" || name === "Categories" || name === "Inventory") {
      return location.pathname.startsWith("/admin/products");
    }
    if (name === "Dashboard" || name === "Customers" || name === "Marketing" || name === "Settings" || name === "Orders" || name === "Analytics") {
      return location.pathname === "/admin/dashboard" && name === "Dashboard";
    }
    return location.pathname === href;
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* ─── DARK SIDEBAR ─────────────────────────────── */}
      <aside className="hidden lg:flex w-56 flex-col bg-[#0f172a] text-white shrink-0 overflow-y-auto">
        {/* Sidebar Logo */}
        <div className="px-5 py-5 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <ShoppingBag className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-base tracking-tight">DashCart</span>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 space-y-0.5 mt-2">
          {sidebarLinks.map((link) => {
            const active = isActive(link.href, link.name) && link.name === (location.pathname.startsWith("/admin/products") ? "Products" : "Dashboard");
            return (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all",
                  active
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* ─── MAIN AREA ────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#f8fafc] dark:bg-zinc-900">
        {/* ─── TOP BAR ────────────────────────────────── */}
        <div className="bg-white dark:bg-zinc-950 border-b shrink-0">
          {/* Top Row: Search + User */}
          <div className="flex items-center justify-between px-6 py-3">
            {/* Search */}
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products, categories..."
                className="pl-10 bg-zinc-100 dark:bg-zinc-800 border-0 h-9 text-sm"
              />
            </div>

            {/* Right: Icons + User */}
            <div className="flex items-center gap-4 ml-4">
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                <Bell className="h-4.5 w-4.5" />
              </button>
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="h-4.5 w-4.5" />
              </button>
              <div className="flex items-center gap-2 ml-2">
                <span className="text-sm font-medium hidden sm:block">{user?.name || "Admin"}</span>
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                  {user?.name?.charAt(0).toUpperCase() || "A"}
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation Row */}
          <div className="flex items-center gap-1 px-6 overflow-x-auto">
            {topTabs.map((tab) => {
              const active = isActive(tab.href, tab.name) && (
                (tab.name === "Products" && location.pathname.startsWith("/admin/products")) ||
                (tab.name === "Dashboard" && location.pathname === "/admin/dashboard")
              );
              return (
                <Link
                  key={tab.name}
                  to={tab.href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap",
                    active
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  <tab.icon className="h-3.5 w-3.5" />
                  {tab.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* ─── CONTENT ────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
