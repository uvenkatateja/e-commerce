import { useState, useEffect } from "react";
import api from "../../api/axios";
import AdminLayout from "../../components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ShoppingCart, Package } from "lucide-react";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/admin/orders?limit=50");
        setOrders(data.data.orders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-50 text-green-600 border-green-200 text-[11px]">Paid</Badge>;
      case "pending":
        return <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50 text-[11px]">Pending</Badge>;
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
        <Skeleton className="h-96 rounded-xl" />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">Order Management</h1>
          <p className="text-sm text-muted-foreground">{orders.length} total orders</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="bg-white dark:bg-zinc-950">
          <CardContent className="pt-5 pb-4">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Total Orders</p>
            <p className="text-2xl font-bold mt-1">{orders.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-zinc-950">
          <CardContent className="pt-5 pb-4">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Paid Orders</p>
            <p className="text-2xl font-bold mt-1 text-green-600">
              {orders.filter((o) => o.paymentStatus === "paid").length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-zinc-950">
          <CardContent className="pt-5 pb-4">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Total Revenue</p>
            <p className="text-2xl font-bold mt-1">
              ${orders.filter((o) => o.paymentStatus === "paid").reduce((sum, o) => sum + o.totalAmount, 0).toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card className="bg-white dark:bg-zinc-950">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <ShoppingCart className="h-4 w-4" />
            All Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No orders yet</p>
            </div>
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
                {orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-mono text-[11px]">
                      #{order._id.slice(-8).toUpperCase()}
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-xs">{order.userId?.name || "Unknown"}</p>
                      <p className="text-[10px] text-muted-foreground">{order.userId?.email || ""}</p>
                    </TableCell>
                    <TableCell className="text-xs">{order.items.length} items</TableCell>
                    <TableCell className="font-medium text-xs">${order.totalAmount.toFixed(2)}</TableCell>
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

export default AdminOrders;
