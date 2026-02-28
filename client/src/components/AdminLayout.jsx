import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * AdminLayout — Wraps all admin pages with a persistent dark sidebar.
 * Matches the DashCart-style dark sidebar navigation.
 * Keeps all existing functionality intact.
 */

const sidebarLinks = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
];

const AdminLayout = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Dark Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-zinc-950 text-white shrink-0">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="font-semibold text-sm">Admin Panel</p>
              <p className="text-xs text-zinc-400 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-4 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive =
              location.pathname === link.href ||
              (link.href === "/admin/products" &&
                location.pathname.startsWith("/admin/products"));
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Back to Store */}
        <div className="p-4 border-t border-white/10">
          <Link
            to="/products"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Store
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-zinc-50 dark:bg-zinc-900 overflow-auto">
        {/* Mobile Top Bar (visible on small screens) */}
        <div className="lg:hidden flex items-center gap-3 p-4 border-b bg-zinc-950">
          {sidebarLinks.map((link) => {
            const isActive =
              location.pathname === link.href ||
              (link.href === "/admin/products" &&
                location.pathname.startsWith("/admin/products"));
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-zinc-400 hover:text-white"
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.name}
              </Link>
            );
          })}
        </div>

        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
