import { useState, useEffect } from "react";
import api from "../../api/axios";
import AdminLayout from "../../components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, DollarSign, ShoppingCart, Package, TrendingUp, Users } from "lucide-react";

const AdminAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/admin/stats");
        setStats(data.data);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </AdminLayout>
    );
  }

  const avgOrderValue = stats?.totalOrders > 0
    ? (stats.totalRevenue / stats.totalOrders).toFixed(2)
    : "0.00";

  const conversionRate = stats?.totalUsers > 0
    ? ((stats.totalOrders / stats.totalUsers) * 100).toFixed(1)
    : "0.0";

  const analyticsCards = [
    {
      title: "Total Revenue",
      value: `$${stats?.totalRevenue?.toFixed(2) || "0.00"}`,
      icon: DollarSign,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Total Products",
      value: stats?.totalProducts || 0,
      icon: Package,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
    {
      title: "Avg. Order Value",
      value: `$${avgOrderValue}`,
      icon: TrendingUp,
      color: "text-cyan-600",
      bg: "bg-cyan-100",
    },
    {
      title: "Conversion Rate",
      value: `${conversionRate}%`,
      icon: BarChart3,
      color: "text-pink-600",
      bg: "bg-pink-100",
    },
  ];

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold">Analytics</h1>
        <p className="text-sm text-muted-foreground">Store performance overview</p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {analyticsCards.map((card, i) => (
          <Card key={i} className="bg-white dark:bg-zinc-950">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold mt-1">{card.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center`}>
                  <card.icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Product Performance */}
      <Card className="bg-white dark:bg-zinc-950">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Product Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Paid Orders</span>
              <span className="font-medium">{stats?.paidOrders || 0}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Low Stock Items</span>
              <span className="font-medium text-orange-600">{stats?.lowStockProducts?.length || 0}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Categories Active</span>
              <span className="font-medium">{stats?.totalProducts > 0 ? "5" : "0"}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminAnalytics;
