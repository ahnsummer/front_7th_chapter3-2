import { useEffect, useState } from "react";
import { ProductWithUI } from "../../App";
import { CartItem, Coupon } from "../../../types";
import { ProductListSection } from "./ProductListSection/ProductListSection";
import { CartSection } from "./CartSection/CartSection";
import { CartService } from "../../domains/cart/hooks/useCart";

type ShopPageProps = {
  cart: CartService;
  coupons: Coupon[];
  productAmount: number;
  filteredProducts: ProductWithUI[];
  searchTerm: string;
};

export function ShopPage({
  cart,
  coupons,
  productAmount,
  filteredProducts,
  searchTerm,
}: ShopPageProps) {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <ProductListSection
        productAmount={productAmount}
        filteredProducts={filteredProducts}
        debouncedSearchTerm={debouncedSearchTerm}
        cart={cart}
      />
      <CartSection
        cart={cart}
        coupons={coupons}
      />
    </div>
  );
}
