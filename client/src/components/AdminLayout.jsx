import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  Warehouse,
  Settings,
} from "lucide-react";

const topTabs = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Inventory", href: "/admin/inventory", icon: Warehouse },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

const AdminLayout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f8fafc] dark:bg-zinc-900">
      {/* Tab Navigation */}
      <div className="bg-white dark:bg-zinc-950 border-b">
        <div className="flex items-center gap-1 px-6 overflow-x-auto">
          {topTabs.map((tab) => {
            const active =
              (tab.name === "Products" && location.pathname.startsWith("/admin/products")) ||
              (tab.name !== "Products" && location.pathname === tab.href);
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

      {/* Content */}
      <main className="p-6">{children}</main>
    </div>
  );
};

export default AdminLayout;
