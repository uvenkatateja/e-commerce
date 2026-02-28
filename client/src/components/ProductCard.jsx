import { memo } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, ShoppingCart, Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * ProductCard — Shopcart-style product card for the user-facing grid.
 * Wrapped with React.memo for performance optimization.
 */
const ProductCard = memo(({ product }) => {
  const isLowStock = product.stockQuantity <= 10 && product.stockQuantity > 0;
  const isOutOfStock = product.stockQuantity === 0;

  return (
    <Card className="group overflow-hidden border hover:shadow-lg transition-all duration-300 bg-white">
      {/* Image */}
      <div className="relative aspect-square bg-zinc-50 p-4 overflow-hidden">
        <Link to={`/products/${product._id}`} id={`product-card-${product._id}`}>
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="h-16 w-16 text-muted-foreground/20" />
            </div>
          )}
        </Link>

        {/* Wishlist Heart */}
        <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
          <Heart className="h-4 w-4 text-gray-400 hover:text-red-500 transition-colors" />
        </button>

        {/* Stock Badges */}
        {isOutOfStock && (
          <Badge className="absolute top-3 left-3 bg-red-500 text-white text-[10px]">
            Sold Out
          </Badge>
        )}
        {isLowStock && (
          <Badge className="absolute top-3 left-3 bg-orange-500 text-white text-[10px]">
            Only {product.stockQuantity} left
          </Badge>
        )}
      </div>

      {/* Info */}
      <div className="p-3 space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <Link to={`/products/${product._id}`} className="hover:underline">
            <h3 className="font-semibold text-sm leading-tight line-clamp-1">
              {product.title}
            </h3>
          </Link>
          <span className="font-bold text-sm whitespace-nowrap">
            ${product.price.toFixed(2)}
          </span>
        </div>

        <p className="text-[11px] text-muted-foreground line-clamp-1 capitalize">
          {product.description || product.category}
        </p>

        {/* Stars */}
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          ))}
          <span className="text-[10px] text-muted-foreground ml-1">(121)</span>
        </div>

        {/* Add to Cart */}
        <Button
          asChild
          variant={isOutOfStock ? "secondary" : "outline"}
          size="sm"
          className="w-full mt-1 text-xs h-8 rounded-full"
          disabled={isOutOfStock}
        >
          <Link to={`/products/${product._id}`}>
            <ShoppingCart className="h-3 w-3 mr-1.5" />
            {isOutOfStock ? "Sold Out" : "Add to Cart"}
          </Link>
        </Button>
      </div>
    </Card>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;
