import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  Warehouse,
  Settings,
  Search,
  Bell,
  Mail,
} from "lucide-react";

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

  return (
    <div className="min-h-[calc(100vh-4rem)]  bg-[#f8fafc] dark:bg-zinc-900">
      {/* ─── TOP BAR ────────────────────────────────── */}
      <div className="bg-white dark:bg-zinc-950 border-b">
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
              <Bell className="h-4 w-4" />
            </button>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <Mail className="h-4 w-4" />
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
            const active =
              (tab.name === "Products" && location.pathname.startsWith("/admin/products")) ||
              (tab.name === "Dashboard" && location.pathname === "/admin/dashboard");
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
      <main className="p-6">{children}</main>
    </div>
  );
};

export default AdminLayout;
