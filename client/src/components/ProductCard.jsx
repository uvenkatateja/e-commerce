import { memo } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";

/**
 * ProductCard — Displays a product in the grid.
 * Wrapped with React.memo for performance optimization
 * (prevents re-render when parent state changes if props haven't changed).
 */
const ProductCard = memo(({ product }) => {
  const isLowStock = product.stockQuantity <= 10;
  const isOutOfStock = product.stockQuantity === 0;

  return (
    <Link to={`/products/${product._id}`} id={`product-card-${product._id}`}>
      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-border/50">
        {/* Product Image */}
        <div className="aspect-square overflow-hidden bg-muted">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <Package className="h-12 w-12 text-muted-foreground/40" />
            </div>
          )}
        </div>

        <CardContent className="p-4 space-y-2">
          {/* Category Badge */}
          <Badge variant="secondary" className="text-xs capitalize">
            {product.category}
          </Badge>

          {/* Title */}
          <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
            {product.title}
          </h3>

          {/* Price & Stock */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
            {isOutOfStock ? (
              <Badge variant="destructive" className="text-xs">
                Out of Stock
              </Badge>
            ) : isLowStock ? (
              <Badge variant="outline" className="text-xs text-orange-500 border-orange-500">
                Low Stock
              </Badge>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;
