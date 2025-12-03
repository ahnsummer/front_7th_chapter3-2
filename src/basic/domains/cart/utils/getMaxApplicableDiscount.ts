import { CartItem } from "../../../../types";
import { maxBy } from "../../../shared/utils/maxBy";

export function getMaxApplicableDiscount(
  item: CartItem,
  hasBulkPurchase: boolean
): number {
  const { discounts } = item.product;
  const { quantity } = item;

  const baseDiscount = maxBy(discounts, (discount) =>
    quantity >= discount.quantity ? discount.rate : 0
  );

  if (hasBulkPurchase) {
    return Math.min(baseDiscount + 0.05, 0.5); // 대량 구매 시 추가 5% 할인
  }

  return baseDiscount;
}
