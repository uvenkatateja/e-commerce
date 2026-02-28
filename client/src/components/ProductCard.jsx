import { memo } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * ProductCard — Premium product card for the user-facing grid.
 * Wrapped with React.memo for performance optimization
 * (prevents re-render when parent state changes if props haven't changed).
 */
const ProductCard = memo(({ product }) => {
  const isLowStock = product.stockQuantity <= 10 && product.stockQuantity > 0;
  const isOutOfStock = product.stockQuantity === 0;

  return (
    <Link to={`/products/${product._id}`} id={`product-card-${product._id}`}>
      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 border-border/50 bg-background">
        {/* Product Image */}
        <div className="aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-800 relative">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <Package className="h-12 w-12 text-muted-foreground/40" />
            </div>
          )}

          {/* Stock Overlay Badge */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Badge variant="destructive" className="text-sm px-4 py-1">
                Sold Out
              </Badge>
            </div>
          )}
          {isLowStock && (
            <Badge
              variant="outline"
              className="absolute top-3 right-3 bg-orange-500/90 text-white border-none text-xs px-2"
            >
              Only {product.stockQuantity} left
            </Badge>
          )}
        </div>

        <CardContent className="p-4 space-y-3">
          {/* Category Badge */}
          <Badge variant="secondary" className="text-xs capitalize font-normal">
            {product.category}
          </Badge>

          {/* Title */}
          <h3 className="font-semibold text-base line-clamp-1 group-hover:text-primary transition-colors">
            {product.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Price & CTA */}
          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-xl font-bold tracking-tight">
              ${product.price.toFixed(2)}
            </span>
            <Button
              size="sm"
              variant={isOutOfStock ? "secondary" : "default"}
              className="h-8 text-xs pointer-events-none"
              disabled={isOutOfStock}
            >
              <ShoppingCart className="h-3.5 w-3.5 mr-1" />
              {isOutOfStock ? "Sold Out" : "Buy Now"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;
