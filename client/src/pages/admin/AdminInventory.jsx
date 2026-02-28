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
import { Warehouse, AlertTriangle, Package } from "lucide-react";

const AdminInventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/products?limit=100");
        setProducts(data.data.products);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const getStockBadge = (qty) => {
    if (qty === 0)
      return <Badge className="bg-red-50 text-red-600 border-red-200 text-[11px]">Out of Stock</Badge>;
    if (qty <= 10)
      return <Badge className="bg-orange-50 text-orange-600 border-orange-200 text-[11px]">Low Stock</Badge>;
    return <Badge className="bg-green-50 text-green-600 border-green-200 text-[11px]">In Stock</Badge>;
  };

  const inStock = products.filter((p) => p.stockQuantity > 10).length;
  const lowStock = products.filter((p) => p.stockQuantity > 0 && p.stockQuantity <= 10).length;
  const outOfStock = products.filter((p) => p.stockQuantity === 0).length;
  const totalUnits = products.reduce((sum, p) => sum + p.stockQuantity, 0);

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
      <div className="mb-6">
        <h1 className="text-xl font-bold">Inventory Management</h1>
        <p className="text-sm text-muted-foreground">Track stock levels across all products</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <Card className="bg-white dark:bg-zinc-950">
          <CardContent className="pt-5 pb-4">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Total Units</p>
            <p className="text-2xl font-bold mt-1">{totalUnits.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-zinc-950">
          <CardContent className="pt-5 pb-4">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">In Stock</p>
            <p className="text-2xl font-bold mt-1 text-green-600">{inStock}</p>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-zinc-950">
          <CardContent className="pt-5 pb-4">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Low Stock</p>
            <p className="text-2xl font-bold mt-1 text-orange-600">{lowStock}</p>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-zinc-950">
          <CardContent className="pt-5 pb-4">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Out of Stock</p>
            <p className="text-2xl font-bold mt-1 text-red-600">{outOfStock}</p>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card className="bg-white dark:bg-zinc-950">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Warehouse className="h-4 w-4" />
            All Products Inventory
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[11px]">Product</TableHead>
                <TableHead className="text-[11px]">Category</TableHead>
                <TableHead className="text-[11px]">Price</TableHead>
                <TableHead className="text-[11px]">Stock Qty</TableHead>
                <TableHead className="text-[11px]">Status</TableHead>
                <TableHead className="text-[11px]">Stock Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products
                .sort((a, b) => a.stockQuantity - b.stockQuantity)
                .map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.title}
                            className="w-8 h-8 rounded object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded bg-zinc-100 flex items-center justify-center">
                            <Package className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                        <span className="font-medium text-xs">{product.title}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs capitalize">{product.category}</TableCell>
                    <TableCell className="text-xs font-medium">${product.price.toFixed(2)}</TableCell>
                    <TableCell className="text-xs font-mono">{product.stockQuantity}</TableCell>
                    <TableCell>{getStockBadge(product.stockQuantity)}</TableCell>
                    <TableCell className="text-xs font-medium">
                      ${(product.price * product.stockQuantity).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminInventory;
