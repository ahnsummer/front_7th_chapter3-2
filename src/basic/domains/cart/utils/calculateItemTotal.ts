import { CartItem } from "../../../../types";
import { getMaxApplicableDiscount } from "./getMaxApplicableDiscount";

export function calculateItemTotalPrice(
  item: CartItem,
  hasBulkPurchase: boolean
): number {
  const { price } = item.product;
  const { quantity } = item;
  const discount = getMaxApplicableDiscount(item, hasBulkPurchase);

  return Math.round(price * quantity * (1 - discount));
}
