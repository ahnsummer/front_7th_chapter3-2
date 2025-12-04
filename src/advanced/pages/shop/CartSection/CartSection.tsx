import { useCart } from "../../../domains/cart/contexts/CartContext";
import { useCoupons } from "../../../domains/coupon/contexts/CouponsContext";
import { addNotification } from "../../../domains/notifications/utils/addNotification";
import { CartItemListSection } from "./CartItemListSection/CartItemListSection";
import { CouponSection } from "./CouponSection/CouponSection";
import { PurchaseSection } from "./PurchaseSection/PurchaseSection";

export function CartSection() {
  const cart = useCart();
  const coupons = useCoupons();

  const cartItems = cart.list.map((item) => ({
    productName: item.product.name,
    quantity: item.quantity,
    discountRate: item.discountRate,
    totalPrice: item.totalPrice,
    maxStock: item.product.stock,
    onDecrease: () => item.updateQuantity(item.quantity - 1),
    onIncrease: () => {
      const success = item.updateQuantity(item.quantity + 1);
      if (!success) {
        addNotification(
          `재고는 ${item.product.stock}개까지만 있습니다.`,
          "error"
        );
      }
    },
    onDelete: () => item.delete(),
  }));

  const handleSelectCoupon = (code: string) => {
    const coupon = coupons.getByCode(code);
    if (coupon == null) {
      cart.clearCoupon();
      return;
    }

    if (
      cart.purchaseInfo.discountedTotalPrice < 10_000 &&
      coupon.discountType === "percentage"
    ) {
      addNotification(
        "percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.",
        "error"
      );
      return;
    }

    cart.selectCoupon(coupon);
    addNotification("쿠폰이 적용되었습니다.", "success");
  };

  const handleRemoveCoupon = () => {
    cart.clearCoupon();
  };

  const handlePurchase = () => {
    const orderNumber = cart.purchase();
    addNotification(
      `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      "success"
    );
  };

  return (
    <div className="lg:col-span-1">
      <div className="sticky top-24 space-y-4">
        <CartItemListSection items={cartItems} />

        {cart.list.length > 0 && (
          <>
            <CouponSection
              couponOptions={coupons.list.map((coupon) => ({
                code: coupon.code,
                name: coupon.name,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
              }))}
              selectedCouponCode={cart.selectedCoupon?.code || ""}
              discountedTotalPrice={cart.purchaseInfo.discountedTotalPrice}
              onSelectCoupon={handleSelectCoupon}
              onRemoveCoupon={handleRemoveCoupon}
            />
            <PurchaseSection
              originalTotalPrice={cart.purchaseInfo.originalTotalPrice}
              discountAmount={cart.purchaseInfo.discountAmount}
              discountedTotalPrice={cart.purchaseInfo.discountedTotalPrice}
              onPurchase={handlePurchase}
            />
          </>
        )}
      </div>
    </div>
  );
}
