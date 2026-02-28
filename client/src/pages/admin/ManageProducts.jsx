import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import AdminLayout from "../../components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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
  ChevronLeft,
  ChevronRight,
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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
    setCurrentPage(1);
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

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const generateSKU = (id) => {
    return id.slice(-6).toUpperCase();
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-xl" />
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
        <h1 className="text-xl font-bold text-foreground">Product Management</h1>
        <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
          <Link to="/admin/products/new">
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Add New Product
          </Link>
        </Button>
      </div>

      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-5">
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-sm bg-white dark:bg-zinc-800 border"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2 ml-auto flex-wrap">
          <Select defaultValue="all">
            <SelectTrigger className="w-28 h-9 text-xs bg-white dark:bg-zinc-800">
              <SelectValue placeholder="Status: All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Status: All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-32 h-9 text-xs bg-white dark:bg-zinc-800">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Category</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat} className="capitalize">
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select defaultValue="all">
            <SelectTrigger className="w-24 h-9 text-xs bg-white dark:bg-zinc-800">
              <SelectValue placeholder="Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Price</SelectItem>
              <SelectItem value="low">Low to High</SelectItem>
              <SelectItem value="high">High to Low</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all">
            <SelectTrigger className="w-24 h-9 text-xs bg-white dark:bg-zinc-800">
              <SelectValue placeholder="Stock" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Stock</SelectItem>
              <SelectItem value="instock">In Stock</SelectItem>
              <SelectItem value="low">Low Stock</SelectItem>
              <SelectItem value="out">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Product Cards Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No products found.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedProducts.map((product) => (
              <Card
                key={product._id}
                className="overflow-hidden bg-white dark:bg-zinc-950 border hover:shadow-md transition-shadow"
              >
                {/* Image */}
                <div className="aspect-square bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center p-4 overflow-hidden">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="h-full w-full object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <Package className="h-16 w-16 text-muted-foreground/20" />
                  )}
                </div>

                {/* Info */}
                <div className="p-3 space-y-1.5">
                  {/* Title + Subtitle */}
                  <div>
                    <h3 className="font-semibold text-sm leading-tight line-clamp-1">
                      {product.title}
                    </h3>
                    <p className="text-[11px] text-muted-foreground line-clamp-1 capitalize">
                      {product.category}
                    </p>
                  </div>

                  {/* SKU + Price Row */}
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">
                      SKU: {generateSKU(product._id)}
                    </span>
                    <span className="text-muted-foreground">Price:</span>
                  </div>

                  {/* Price + Stock Row */}
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-base">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {product.stockQuantity} in stock
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div>
                    <Badge
                      variant="outline"
                      className={
                        product.stockQuantity > 0
                          ? "text-[10px] px-1.5 py-0 text-green-600 bg-green-50 border-green-200"
                          : "text-[10px] px-1.5 py-0 text-red-600 bg-red-50 border-red-200"
                      }
                    >
                      Status: {product.stockQuantity > 0 ? "Active" : "Out of Stock"}
                    </Badge>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1 pt-1.5 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 h-7 text-[11px] px-1 text-muted-foreground hover:text-foreground"
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
                      className="flex-1 h-7 text-[11px] px-1 text-muted-foreground hover:text-foreground"
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
                      className="h-7 text-[11px] px-1 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() =>
                        setDeleteDialog({ open: true, product })
                      }
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <span className="text-sm text-muted-foreground px-3">
                Page {currentPage} of {totalPages}
              </span>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(
                  (num) => (
                    <Button
                      key={num}
                      variant={num === currentPage ? "default" : "outline"}
                      size="icon"
                      className="h-8 w-8 text-xs"
                      onClick={() => setCurrentPage(num)}
                    >
                      {num}
                    </Button>
                  )
                )}
              </div>

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
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
