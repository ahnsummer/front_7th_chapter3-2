import { Coupon } from "../../../../types";

export function applyCouponToTotalPrice(
  totalPrice: number,
  coupon: Coupon | null
): number {
  if (coupon == null) return totalPrice;

  if (coupon.discountType === "amount") {
    return Math.max(0, totalPrice - coupon.discountValue);
  } else {
    return totalPrice * (1 - coupon.discountValue / 100);
  }
}
