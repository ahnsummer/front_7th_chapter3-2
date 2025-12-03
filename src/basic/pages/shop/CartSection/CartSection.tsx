import { CartItem, Coupon } from "../../../../types";
import { CartService } from "../../../domains/cart/hooks/useCart";
import { addNotification } from "../../../domains/notifications/utils/addNotification";
import { CartItemListSection } from "./CartItemListSection/CartItemListSection";
import { CouponSection } from "./CouponSection/CouponSection";
import { PurchaseSection } from "./PurchaseSection/PurchaseSection";

type CartSectionProps = {
  cart: CartService;
  coupons: Coupon[];
};

export function CartSection({ cart, coupons }: CartSectionProps) {
  return (
    <div className="lg:col-span-1">
      <div className="sticky top-24 space-y-4">
        <CartItemListSection cart={cart} />

        {cart.list.length > 0 && (
          <>
            <CouponSection
              cart={cart}
              coupons={coupons}
              selectedCoupon={cart.selectedCoupon}
              onApplyCoupon={cart.selectCoupon}
              onRemoveCoupon={cart.clearCoupon}
            />
            <PurchaseSection cart={cart} />
          </>
        )}
      </div>
    </div>
  );
}
