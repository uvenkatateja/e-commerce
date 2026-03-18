import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCurrency } from "../../context/CurrencyContext";
import api from "../../api/axios";
import AdminLayout from "../../components/AdminLayout";
import CurrencySelector from "../../components/CurrencySelector";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Settings,
  User,
  Shield,
  Store,
  Globe,
  History,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

const AdminSettings = () => {
  const { user } = useAuth();
  const { formatPrice, currency, rates, lastUpdated, refreshRates, loading: ratesLoading } = useCurrency();

  const [storeName, setStoreName] = useState("E-Commerce Store");
  const [storeEmail, setStoreEmail] = useState(user?.email || "admin@ecommerce.com");
  const [priceHistory, setPriceHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  // Fetch price history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get("/admin/price-history?limit=50");
        setPriceHistory(data.data.history);
      } catch (error) {
        console.error("Failed to fetch price history:", error);
      } finally {
        setHistoryLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    toast.success("Settings saved successfully");
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your store configuration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT COLUMN — Settings */}
        <div className="lg:col-span-2 space-y-6">

          {/* Admin Profile */}
          <Card className="bg-white dark:bg-zinc-950">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4" />
                Admin Profile
              </CardTitle>
              <CardDescription className="text-xs">Your admin account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
                  {user?.name?.charAt(0).toUpperCase() || "A"}
                </div>
                <div>
                  <p className="font-semibold">{user?.name || "Admin User"}</p>
                  <p className="text-sm text-muted-foreground">{user?.email || "admin@ecommerce.com"}</p>
                  <Badge className="mt-1 bg-blue-50 text-blue-600 border-blue-200 text-[10px]">
                    <Shield className="h-3 w-3 mr-1" />
                    {user?.role || "admin"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Store Settings */}
          <Card className="bg-white dark:bg-zinc-950">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Store className="h-4 w-4" />
                Store Configuration
              </CardTitle>
              <CardDescription className="text-xs">Configure your store settings</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="storeName" className="text-xs">Store Name</Label>
                  <Input
                    id="storeName"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeEmail" className="text-xs">Contact Email</Label>
                  <Input
                    id="storeEmail"
                    type="email"
                    value={storeEmail}
                    onChange={(e) => setStoreEmail(e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
                <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* ─── PRICE CHANGE HISTORY ─────────────────────────── */}
          <Card className="bg-white dark:bg-zinc-950">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <History className="h-4 w-4" />
                Price Change History
              </CardTitle>
              <CardDescription className="text-xs">
                All product pricing changes are logged here with timestamps
              </CardDescription>
            </CardHeader>
            <CardContent>
              {historyLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 rounded-lg" />
                  ))}
                </div>
              ) : priceHistory.length === 0 ? (
                <div className="text-center py-12">
                  <History className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground font-medium">No price changes recorded yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Price changes will appear here when you update product prices</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-[11px]">Date & Time</TableHead>
                        <TableHead className="text-[11px]">Product</TableHead>
                        <TableHead className="text-[11px]">Old Price</TableHead>
                        <TableHead className="text-[11px]"></TableHead>
                        <TableHead className="text-[11px]">New Price</TableHead>
                        <TableHead className="text-[11px]">Change</TableHead>
                        <TableHead className="text-[11px]">Changed By</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {priceHistory.map((entry) => {
                        const priceDiff = entry.newPrice - entry.oldPrice;
                        const percentChange = entry.oldPrice > 0
                          ? ((priceDiff / entry.oldPrice) * 100).toFixed(1)
                          : 0;
                        const isIncrease = priceDiff > 0;

                        return (
                          <TableRow key={entry._id}>
                            <TableCell className="text-[11px] text-muted-foreground whitespace-nowrap">
                              <div>
                                <p className="font-medium text-foreground">
                                  {new Date(entry.createdAt).toLocaleDateString()}
                                </p>
                                <p className="text-[10px]">
                                  {new Date(entry.createdAt).toLocaleTimeString()}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <p className="font-medium text-xs line-clamp-1">{entry.productTitle}</p>
                            </TableCell>
                            <TableCell className="font-mono text-xs text-muted-foreground">
                              {formatPrice(entry.oldPrice)}
                            </TableCell>
                            <TableCell>
                              <ArrowRight className="h-3 w-3 text-muted-foreground" />
                            </TableCell>
                            <TableCell className="font-mono text-xs font-medium">
                              {formatPrice(entry.newPrice)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={`text-[10px] ${
                                  isIncrease
                                    ? "text-red-600 bg-red-50 border-red-200"
                                    : "text-green-600 bg-green-50 border-green-200"
                                }`}
                              >
                                {isIncrease ? (
                                  <TrendingUp className="h-3 w-3 mr-0.5" />
                                ) : (
                                  <TrendingDown className="h-3 w-3 mr-0.5" />
                                )}
                                {isIncrease ? "+" : ""}{percentChange}%
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {entry.changedBy?.name || "Unknown"}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* System Info */}
          <Card className="bg-white dark:bg-zinc-950">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Settings className="h-4 w-4" />
                System Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Stack</span>
                  <span className="font-medium">MERN (MongoDB, Express, React, Node.js)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Gateway</span>
                  <span className="font-medium">Stripe</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Authentication</span>
                  <span className="font-medium">JWT (httpOnly Cookies)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Currency API</span>
                  <span className="font-medium">frankfurter.app (ECB rates)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Version</span>
                  <span className="font-medium">1.1.0</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN — Currency Panel */}
        <div className="space-y-6">

          {/* Currency Selection Panel */}
          <CurrencySelector />

          {/* Live Exchange Rates */}
          <Card className="bg-white dark:bg-zinc-950">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4" />
                  Live Exchange Rates
                </CardTitle>
                <button
                  onClick={refreshRates}
                  disabled={ratesLoading}
                  className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Refresh rates"
                >
                  <RefreshCw className={`h-3.5 w-3.5 text-gray-400 ${ratesLoading ? "animate-spin" : ""}`} />
                </button>
              </div>
              <CardDescription className="text-xs">
                Sourced from European Central Bank via frankfurter.app
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1.5 max-h-[400px] overflow-y-auto scrollbar-none">
                {Object.entries(rates).map(([code, rate]) => (
                  <div
                    key={code}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                      code === currency ? "bg-blue-50 dark:bg-blue-950/30 border border-blue-100" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${code === currency ? "text-blue-600" : "text-gray-500"}`}>
                        {code}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-medium">
                        {rate.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {lastUpdated && (
                <p className="text-[9px] text-muted-foreground mt-3 text-center">
                  Last updated: {new Date(lastUpdated).toLocaleString()}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
