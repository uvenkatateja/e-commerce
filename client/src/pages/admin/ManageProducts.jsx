import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import AdminLayout from "../../components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  Package,
  Eye,
  Search,
} from "lucide-react";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, product: null });
  const [deleting, setDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [categories, setCategories] = useState([]);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get("/products?limit=100");
      setProducts(data.data.products);
      setFilteredProducts(data.data.products);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/products/categories");
        setCategories(data.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Filter products locally (instant feedback)
  useEffect(() => {
    let result = products;
    if (searchQuery) {
      result = result.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (categoryFilter && categoryFilter !== "all") {
      result = result.filter((p) => p.category === categoryFilter);
    }
    setFilteredProducts(result);
  }, [searchQuery, categoryFilter, products]);

  const handleDelete = async () => {
    if (!deleteDialog.product) return;
    setDeleting(true);

    try {
      await api.delete(`/products/${deleteDialog.product._id}`);
      toast.success("Product deleted");
      setProducts((prev) =>
        prev.filter((p) => p._id !== deleteDialog.product._id)
      );
      setDeleteDialog({ open: false, product: null });
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const getStockStatus = (qty) => {
    if (qty === 0) return { label: "Out of Stock", color: "text-red-500 bg-red-500/10 border-red-500/20" };
    if (qty <= 10) return { label: "Low Stock", color: "text-orange-500 bg-orange-500/10 border-orange-500/20" };
    return { label: "In Stock", color: "text-green-500 bg-green-500/10 border-green-500/20" };
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-72 rounded-xl" />
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Product Management</h1>
          <p className="text-sm text-muted-foreground">{products.length} total products</p>
        </div>
        <Button asChild>
          <Link to="/admin/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Add New Product
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-44 bg-background">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat} className="capitalize">
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map((product) => {
            const status = getStockStatus(product.stockQuantity);
            return (
              <Card
                key={product._id}
                className="group overflow-hidden bg-background border transition-all duration-200 hover:shadow-lg"
              >
                {/* Product Image */}
                <div className="aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-800 relative">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <Package className="h-12 w-12 text-muted-foreground/30" />
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-sm line-clamp-1">{product.title}</h3>
                    <p className="text-xs text-muted-foreground capitalize">{product.category}</p>
                  </div>

                  {/* Price & Stock Row */}
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                    <span className="text-xs text-muted-foreground">
                      {product.stockQuantity} in stock
                    </span>
                  </div>

                  {/* Status Badge */}
                  <Badge variant="outline" className={`text-xs ${status.color}`}>
                    {status.label}
                  </Badge>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-1 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 h-8 text-xs"
                      asChild
                    >
                      <Link to={`/admin/products/edit/${product._id}`}>
                        <Pencil className="h-3 w-3 mr-1" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 h-8 text-xs"
                      asChild
                    >
                      <Link to={`/products/${product._id}`}>
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs text-destructive hover:text-destructive"
                      onClick={() =>
                        setDeleteDialog({ open: true, product })
                      }
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          !open && setDeleteDialog({ open: false, product: null })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deleteDialog.product?.title}&quot;?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, product: null })}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default ManageProducts;
