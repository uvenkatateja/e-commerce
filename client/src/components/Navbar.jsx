import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  ShoppingBag,
  LogOut,
  LayoutDashboard,
  User,
  Search,
  ShoppingCart,
  ChevronDown,
  Package,
  Heart,
  ClipboardList,
} from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = async () => {
    await logout();
    setMobileOpen(false);
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <ShoppingBag className="h-7 w-7 text-[#1b4332]" />
          <span className="text-xl font-bold tracking-tight text-gray-900">
            E-Commerce
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-6">
          <DropdownMenu>
            <DropdownMenuTrigger className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors flex items-center gap-1 outline-none">
              Categories
              <ChevronDown className="h-3.5 w-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40">
              <DropdownMenuItem asChild>
                <Link to="/products?category=electronics">Electronics</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/products?category=footwear">Footwear</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/products?category=fitness">Fitness</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/products?category=accessories">Accessories</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/products?category=home">Home</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            to="/deals"
            className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            Deals
          </Link>
          <Link
            to="/whats-new"
            className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            What's New
          </Link>
          <Link
            to="/delivery"
            className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            Delivery
          </Link>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xs relative">
          <Input
            type="text"
            placeholder="Search Product"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10 h-9 bg-zinc-50 border-zinc-200 rounded-lg text-sm"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            <Search className="h-4 w-4" />
          </button>
        </form>

        {/* Right Section — Account & Cart */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-gray-900 outline-none transition-colors">
                  <User className="h-5 w-5" />
                  <span className="hidden lg:inline font-medium">{user?.name?.split(" ")[0] || "Account"}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin/dashboard">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/orders">
                      <ClipboardList className="mr-2 h-4 w-4" />
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link
                to="/products"
                className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-gray-900 transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="hidden lg:inline font-medium">Cart</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-gray-900 transition-colors"
              >
                <User className="h-5 w-5" />
                <span className="hidden lg:inline font-medium">Account</span>
              </Link>
              <Link
                to="/products"
                className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-gray-900 transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="hidden lg:inline font-medium">Cart</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetTitle className="flex items-center gap-2 mb-6">
              <div className="bg-[#1b4332] p-1.5 rounded-lg">
                <ShoppingBag className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-gray-900">E-Commerce</span>
            </SheetTitle>

            {/* Mobile Search */}
            <form onSubmit={(e) => { handleSearch(e); setMobileOpen(false); }} className="mb-6">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search Product"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 h-11 bg-zinc-50 border-zinc-200 rounded-xl text-sm focus:ring-[#1b4332]/20"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </form>

            <div className="flex flex-col gap-1">
              {["Electronics", "Footwear", "Fitness", "Accessories", "Home"].map((cat) => (
                <Link 
                  key={cat}
                  to={`/products?category=${cat.toLowerCase()}`} 
                  onClick={() => setMobileOpen(false)} 
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 py-3 px-1 transition-colors"
                >
                  {cat}
                </Link>
              ))}

              <div className="border-t border-gray-100 my-4" />

              {isAuthenticated ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 px-1">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-500" />
                    </div>
                    <span className="text-sm font-bold text-gray-900">{user?.name}</span>
                  </div>
                  <Link 
                    to="/orders" 
                    onClick={() => setMobileOpen(false)} 
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-3 py-1 px-1 transition-colors"
                  >
                    <ClipboardList className="h-5 w-5 text-gray-400" />
                    My Orders
                  </Link>
                  <button 
                    onClick={handleLogout} 
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-3 py-1 px-1 text-left transition-colors"
                  >
                    <LogOut className="h-5 w-5 text-gray-400" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="text-sm font-bold text-gray-900 flex items-center gap-3 py-1 px-1">
                    <User className="h-5 w-5 text-gray-400" />
                    Account
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="text-sm font-bold text-[#1b4332] flex items-center gap-2 py-1 px-1">
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;
