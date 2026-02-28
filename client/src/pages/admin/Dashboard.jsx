import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import AdminLayout from "../../components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          api.get("/admin/stats"),
          api.get("/admin/orders?limit=5"),
        ]);
        setStats(statsRes.data.data);
        setRecentOrders(ordersRes.data.data.orders);
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="bg-green-50 text-green-600 border-green-200 text-[11px]">
            Paid
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50 text-[11px]">
            Pending
          </Badge>
        );
      case "failed":
        return <Badge variant="destructive" className="text-[11px]">Failed</Badge>;
      default:
        return <Badge variant="secondary" className="text-[11px]">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </AdminLayout>
    );
  }

  const statCards = [
    {
      title: "Total Revenue",
      value: `$${stats?.totalRevenue?.toFixed(2) || "0.00"}`,
      icon: DollarSign,
      color: "text-green-600",
      bg: "bg-green-50",
      iconBg: "bg-green-100",
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      subtitle: `${stats?.paidOrders || 0} paid`,
      icon: ShoppingCart,
      color: "text-blue-600",
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
    },
    {
      title: "Products",
      value: stats?.totalProducts || 0,
      icon: Package,
      color: "text-purple-600",
      bg: "bg-purple-50",
      iconBg: "bg-purple-100",
    },
    {
      title: "Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "text-orange-600",
      bg: "bg-orange-50",
      iconBg: "bg-orange-100",
    },
  ];

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">Dashboard Overview</h1>
          <p className="text-sm text-muted-foreground">Welcome back, here&apos;s what&apos;s happening</p>
        </div>
        <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
          <Link to="/admin/products">
            <Package className="h-3.5 w-3.5 mr-1.5" />
            Manage Products
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat, i) => (
          <Card key={i} className="bg-white dark:bg-zinc-950">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  {stat.subtitle && (
                    <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                      <ArrowUpRight className="h-3 w-3 text-green-500" />
                      {stat.subtitle}
                    </p>
                  )}
                </div>
                <div className={`w-10 h-10 rounded-lg ${stat.iconBg} flex items-center justify-center`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Low Stock Alert */}
      {stats?.lowStockProducts?.length > 0 && (
        <Card className="mb-6 border-orange-200 bg-orange-50/50 dark:bg-orange-950/20">
          <CardHeader className="py-3">
            <CardTitle className="flex items-center gap-2 text-orange-600 text-sm">
              <AlertTriangle className="h-4 w-4" />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 pb-3">
            <div className="flex flex-wrap gap-2">
              {stats.lowStockProducts.map((p) => (
                <Badge
                  key={p._id}
                  variant="outline"
                  className="text-orange-600 border-orange-300 bg-white text-[11px]"
                >
                  {p.title} ({p.stockQuantity} left)
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Orders */}
      <Card className="bg-white dark:bg-zinc-950">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4" />
            Recent Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <p className="text-muted-foreground text-center py-8 text-sm">
              No orders yet
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[11px]">Order ID</TableHead>
                  <TableHead className="text-[11px]">Customer</TableHead>
                  <TableHead className="text-[11px]">Items</TableHead>
                  <TableHead className="text-[11px]">Total</TableHead>
                  <TableHead className="text-[11px]">Status</TableHead>
                  <TableHead className="text-[11px]">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-mono text-[11px]">
                      #{order._id.slice(-8).toUpperCase()}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-xs">{order.userId?.name || "Unknown"}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {order.userId?.email || ""}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">{order.items.length} items</TableCell>
                    <TableCell className="font-medium text-xs">
                      ${order.totalAmount.toFixed(2)}
                    </TableCell>
                    <TableCell>{getStatusBadge(order.paymentStatus)}</TableCell>
                    <TableCell className="text-[11px] text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default Dashboard;
