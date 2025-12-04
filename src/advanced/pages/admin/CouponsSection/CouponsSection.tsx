import { useCoupons } from "../../../domains/coupon/contexts/CouponsContext";
import { useCouponForm } from "../../../domains/coupon/hooks/useCouponForm";
import { CouponList } from "./CouponList/CouponList";
import { CouponForm } from "./CouponForm/CouponForm";

export function CouponsSection() {
  const coupons = useCoupons();
  const {
    showCouponForm,
    couponForm,
    updateForm,
    handleCouponSubmit,
    handleFormCancel,
    deleteCoupon,
    startAddCoupon,
  } = useCouponForm();

  const couponItems = coupons.list.map((coupon) => ({
    code: coupon.code,
    name: coupon.name,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    onDelete: () => deleteCoupon(coupon.code),
  }));

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold">쿠폰 관리</h2>
      </div>
      <div className="p-6">
        <CouponList coupons={couponItems} onAddClick={startAddCoupon} />

        {showCouponForm && (
          <CouponForm
            couponForm={couponForm}
            onFormChange={updateForm}
            onSubmit={handleCouponSubmit}
            onCancel={handleFormCancel}
          />
        )}
      </div>
    </section>
  );
}

