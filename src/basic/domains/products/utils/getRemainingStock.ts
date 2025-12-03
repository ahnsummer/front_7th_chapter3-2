import { CartItem } from "../../../../types";

export const getRemainingStock = (cartItem: CartItem): number => {
  return cartItem.product.stock - (cartItem?.quantity || 0);
};
