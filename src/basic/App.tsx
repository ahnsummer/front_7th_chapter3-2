import { useState, useEffect } from "react";
import { Coupon } from "../types";
import { NotificationArea } from "./domains/notifications/components/NotificationArea";
import { Header } from "./shared/layout/components/Header";
import { AdminPage } from "./pages/admin/AdminPage";
import { ShopPage } from "./pages/shop/ShopPage";
import { useCart } from "./domains/cart/hooks/useCart";
import { addNotification } from "./domains/notifications/utils/addNotification";
import { ProductWithUI } from "./domains/products/types/ProductWithUI";
import { initialProducts } from "./domains/products/constants/initialProducts";
import { initialCoupons } from "./domains/coupon/constants/initialCoupons";
import { useProducts } from "./domains/products/hooks/useProducts";

const App = () => {
  // const [products, setProducts] = useState<ProductWithUI[]>(() => {
  //   const saved = localStorage.getItem("products");
  //   if (saved) {
  //     try {
  //       return JSON.parse(saved);
  //     } catch {
  //       return initialProducts;
  //     }
  //   }
  //   return initialProducts;
  // });

  const products = useProducts();

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem("coupons");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialCoupons;
      }
    }
    return initialCoupons;
  });

  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const cart = useCart();

  useEffect(() => {
    localStorage.setItem("coupons", JSON.stringify(coupons));
  }, [coupons]);

  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationArea />

      <Header
        title="SHOP"
        middleAccessory={
          !isAdmin && (
            <div className="ml-8 flex-1 max-w-md">
              <input
                type="text"
                onChange={(e) => products.search(e.target.value)}
                placeholder="상품 검색..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          )
        }
        rightAccessory={
          <>
            <button
              onClick={() => setIsAdmin(!isAdmin)}
              className={`px-3 py-1.5 text-sm rounded transition-colors ${
                isAdmin
                  ? "bg-gray-800 text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}>
              {isAdmin ? "쇼핑몰로 돌아가기" : "관리자 페이지로"}
            </button>
            {!isAdmin && (
              <div className="relative">
                <svg
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {cart.list.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.totalItemCount}
                  </span>
                )}
              </div>
            )}
          </>
        }
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage
            products={products}
            coupons={coupons}
            onAddCoupon={(newCoupon) => {
              const existingCoupon = coupons.find(
                (c) => c.code === newCoupon.code
              );
              if (existingCoupon) {
                addNotification("이미 존재하는 쿠폰 코드입니다.", "error");
                return;
              }
              setCoupons((prev) => [...prev, newCoupon]);
              addNotification("쿠폰이 추가되었습니다.", "success");
            }}
            onDeleteCoupon={(couponCode) => {
              setCoupons((prev) => prev.filter((c) => c.code !== couponCode));
              if (selectedCoupon?.code === couponCode) {
                setSelectedCoupon(null);
              }
              addNotification("쿠폰이 삭제되었습니다.", "success");
            }}
            onError={(errorMessage) => {
              addNotification(errorMessage, "error");
            }}
          />
        ) : (
          <ShopPage
            cart={cart}
            products={products}
            coupons={coupons}
          />
        )}
      </main>
    </div>
  );
};

export default App;
