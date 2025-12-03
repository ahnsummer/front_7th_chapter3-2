import { useEffect, useState } from "react";
import { CartItem, Coupon, Product } from "../../../../types";
import { useLocalStorage } from "../../../shared/hooks/useLocalStorage";
import { sumBy } from "../../../shared/utils/sum";
import { getMaxApplicableDiscount } from "../utils/getMaxApplicableDiscount";
import { iife } from "../../../shared/utils/iife";
import { applyCouponToTotalPrice } from "../utils/applyCoupon";
import { calculateItemTotalPrice } from "../utils/calculateItemTotal";
import { getRemainingStock } from "../../products/utils/getRemainingStock";

type CartItemInstance = CartItem & {
  totalPrice: number;
  discountRate: number;
  remainingStock: number;

  updateQuantity: (newQuantity: number) => boolean;
  delete: () => void;
};

export type CartService = {
  list: CartItemInstance[];
  hasBulkPurchase: boolean;
  totalItemCount: number;
  purchaseInfo: {
    originalTotalPrice: number;
    discountedTotalPrice: number;
    discountAmount: number;
  };
  selectedCoupon: Coupon | null;

  getById: (productId: string) => CartItemInstance | undefined;

  addItem: (product: Product) => void;

  selectCoupon: (coupon: Coupon) => void;
  clearCoupon: () => void;

  purchase: () => string;
};

export function useCart(): CartService {
  const [cart, setCart] = useLocalStorage<CartItem[]>("cart", []);

  // useEffect(() => {
  //   if (cart.length === 0) {
  //     localStorage.removeItem("cart");
  //   }
  // }, [cart]);

  useEffect(() => {
    console.log("cart", cart);
  }, []);

  const hasBulkPurchase = cart.some((item) => item.quantity >= 10);

  const totalItemCount = sumBy(cart, (item) => item.quantity);

  const cartInstance: CartItemInstance[] = cart.map((item, idx) => {
    return {
      ...item,
      totalPrice: calculateItemTotalPrice(item, hasBulkPurchase),
      discountRate: Math.round(
        getMaxApplicableDiscount(item, hasBulkPurchase) * 100
      ),
      remainingStock: getRemainingStock(item),
      updateQuantity: (newQuantity: number) => {
        if (newQuantity < 0) return false;
        if (newQuantity > item.product.stock) return false;

        setCart((prev) => {
          if (newQuantity === 0) {
            return prev.filter((_, i) => i !== idx);
          }

          prev[idx].quantity = newQuantity;
          return [...prev];
        });

        return true;
      },
      delete: () => {
        setCart((prev) => prev.filter((_, i) => i !== idx));
      },
    };
  });

  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const purchaseInfo: CartService["purchaseInfo"] = iife(() => {
    const originalTotalPrice = sumBy(
      cart,
      (item) => item.product.price * item.quantity
    );

    const discountedTotalPrice = iife(() => {
      const totalPrice = sumBy(cart, (item) =>
        calculateItemTotalPrice(item, hasBulkPurchase)
      );

      return applyCouponToTotalPrice(totalPrice, selectedCoupon);
    });

    const discountAmount = originalTotalPrice - discountedTotalPrice;

    return {
      originalTotalPrice,
      discountedTotalPrice,
      discountAmount,
    };
  });

  const getItemByProductId = (productId: string) => {
    return cartInstance.find((item) => item.product.id === productId);
  };

  const addItem = (product: Product) => {
    setCart((prev) => [...prev, { product, quantity: 1 }]);
  };

  const selectCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
  };

  const clearCoupon = () => {
    setSelectedCoupon(null);
  };

  const purchase = () => {
    const orderNumber = `ORD-${Date.now()}`;

    setCart([]);
    setSelectedCoupon(null);

    return orderNumber;
  };

  return {
    list: cartInstance,
    hasBulkPurchase,
    totalItemCount,
    purchaseInfo,
    selectedCoupon,
    getById: getItemByProductId,
    addItem,
    selectCoupon,
    clearCoupon,
    purchase,
  };
}
