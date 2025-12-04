import { useState, useCallback } from "react";
import { Coupon } from "../../../../types";
import { useCoupons } from "../contexts/CouponsContext";
import { useCart } from "../../cart/contexts/CartContext";
import { addNotification } from "../../notifications/utils/addNotification";

type CouponFormData = {
  name: string;
  code: string;
  discountType: "amount" | "percentage";
  discountValue: number;
};

const initialFormData: CouponFormData = {
  name: "",
  code: "",
  discountType: "amount",
  discountValue: 0,
};

export function useCouponForm() {
  const coupons = useCoupons();
  const cart = useCart();
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [couponForm, setCouponForm] = useState<CouponFormData>(initialFormData);

  const resetForm = useCallback(() => {
    setCouponForm(initialFormData);
    setShowCouponForm(false);
  }, []);

  const addCoupon = useCallback(
    (newCoupon: Coupon) => {
      if (coupons.has(newCoupon.code)) {
        addNotification("이미 존재하는 쿠폰 코드입니다.", "error");
        return;
      }

      coupons.addItem(newCoupon);
      addNotification("쿠폰이 추가되었습니다.", "success");
    },
    [coupons]
  );

  const deleteCoupon = useCallback(
    (couponCode: string) => {
      coupons.getByCode(couponCode)?.delete();
      if (cart.selectedCoupon?.code === couponCode) {
        cart.clearCoupon();
      }
      addNotification("쿠폰이 삭제되었습니다.", "success");
    },
    [coupons, cart]
  );

  const handleCouponSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      addCoupon(couponForm);
      resetForm();
    },
    [couponForm, addCoupon, resetForm]
  );

  const handleFormCancel = useCallback(() => {
    resetForm();
  }, [resetForm]);

  const updateForm = useCallback((updates: Partial<CouponFormData>) => {
    setCouponForm((prev) => ({ ...prev, ...updates }));
  }, []);

  const startAddCoupon = useCallback(() => {
    setShowCouponForm(true);
  }, []);

  return {
    showCouponForm,
    couponForm,
    updateForm,
    handleCouponSubmit,
    handleFormCancel,
    deleteCoupon,
    startAddCoupon,
  };
}
