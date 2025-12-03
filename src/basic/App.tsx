import { useState, useEffect } from "react";
import { Coupon, Product } from "../types";
import { NotificationArea } from "./domains/notifications/components/NotificationArea";
import { Header } from "./shared/layout/components/Header";
import { AdminPage } from "./pages/admin/AdminPage";
import { ShopPage } from "./pages/shop/ShopPage";
import { useCart } from "./domains/cart/hooks/useCart";
import { addNotification } from "./domains/notifications/utils/addNotification";

export type ProductWithUI = Product & {
  description?: string;
  isRecommended?: boolean;
};

export type Notification = {
  id: string;
  message: string;
  type: "error" | "success" | "warning";
};

// 초기 데이터
const initialProducts: ProductWithUI[] = [
  {
    id: "p1",
    name: "상품1",
    price: 10000,
    stock: 20,
    discounts: [
      { quantity: 10, rate: 0.1 },
      { quantity: 20, rate: 0.2 },
    ],
    description: "최고급 품질의 프리미엄 상품입니다.",
  },
  {
    id: "p2",
    name: "상품2",
    price: 20000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.15 }],
    description: "다양한 기능을 갖춘 실용적인 상품입니다.",
    isRecommended: true,
  },
  {
    id: "p3",
    name: "상품3",
    price: 30000,
    stock: 20,
    discounts: [
      { quantity: 10, rate: 0.2 },
      { quantity: 30, rate: 0.25 },
    ],
    description: "대용량과 고성능을 자랑하는 상품입니다.",
  },
];

const initialCoupons: Coupon[] = [
  {
    name: "5000원 할인",
    code: "AMOUNT5000",
    discountType: "amount",
    discountValue: 5000,
  },
  {
    name: "10% 할인",
    code: "PERCENT10",
    discountType: "percentage",
    discountValue: 10,
  },
];

const App = () => {
  const [products, setProducts] = useState<ProductWithUI[]>(() => {
    const saved = localStorage.getItem("products");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialProducts;
      }
    }
    return initialProducts;
  });

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

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const cart = useCart();

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("coupons", JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredProducts = debouncedSearchTerm
    ? products.filter(
        (product) =>
          product.name
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          (product.description &&
            product.description
              .toLowerCase()
              .includes(debouncedSearchTerm.toLowerCase()))
      )
    : products;

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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
            onAddProduct={(product) => {
              setProducts((prev) => [...prev, product]);
              addNotification("상품이 추가되었습니다.", "success");
            }}
            onUpdateProduct={(productId, updates) => {
              setProducts((prev) =>
                prev.map((product) =>
                  product.id === productId
                    ? { ...product, ...updates }
                    : product
                )
              );
              addNotification("상품이 수정되었습니다.", "success");
            }}
            onDeleteProduct={(productId) => {
              setProducts((prev) =>
                prev.filter((product) => product.id !== productId)
              );
              addNotification("상품이 삭제되었습니다.", "success");
            }}
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
            coupons={coupons}
            productAmount={products.length}
            filteredProducts={filteredProducts}
            searchTerm={searchTerm}
          />
        )}
      </main>
    </div>
  );
};

export default App;
