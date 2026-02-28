import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu, ShoppingBag, LogOut, LayoutDashboard, User, Package } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setMobileOpen(false);
    navigate("/");
  };

  const NavLinks = ({ mobile = false }) => {
    const closeMobile = () => mobile && setMobileOpen(false);

    // Admin only sees Dashboard link (admin pages have their own tab nav)
    if (isAdmin) {
      return (
        <Link
          to="/admin/dashboard"
          onClick={closeMobile}
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Link>
      );
    }

    return (
      <>
        <Link
          to="/products"
          onClick={closeMobile}
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Products
        </Link>

        {isAuthenticated && (
          <Link
            to="/orders"
            onClick={closeMobile}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            My Orders
          </Link>
        )}
      </>
    );
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <ShoppingBag className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold tracking-tight">E-Commerce</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <NavLinks />
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{user?.name}</span>
                {isAdmin && (
                  <Badge variant="secondary" className="text-xs">
                    Admin
                  </Badge>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/register">Get Started</Link>
              </Button>
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
              <ShoppingBag className="h-5 w-5 text-primary" />
              E-Commerce
            </SheetTitle>
            <div className="flex flex-col gap-4">
              <NavLinks mobile />

              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-2 pt-4 border-t">
                    <User className="h-4 w-4" />
                    <span className="text-sm">{user?.name}</span>
                    {isAdmin && <Badge variant="secondary">Admin</Badge>}
                  </div>
                  <Button variant="ghost" onClick={handleLogout} className="justify-start">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-4 border-t">
                  <Button variant="ghost" asChild onClick={() => setMobileOpen(false)}>
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button asChild onClick={() => setMobileOpen(false)}>
                    <Link to="/register">Get Started</Link>
                  </Button>
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
