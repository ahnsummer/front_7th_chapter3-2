import { useProducts } from "../../../domains/products/contexts/ProductsContext";
import { useCart } from "../../../domains/cart/contexts/CartContext";
import { addNotification } from "../../../domains/notifications/utils/addNotification";
import { ProductCard } from "./ProductCard/ProductCard";

export function ProductListSection() {
  const products = useProducts();
  const cart = useCart();

  const getProductCardData = (product: (typeof products.list)[0]) => {
    const cartItem = cart.getById(product.id);
    const remainingStock = cartItem?.remainingStock ?? product.stock;
    const discountRate =
      product.discounts.length > 0
        ? Math.max(...product.discounts.map((d) => d.rate)) * 100
        : 0;

    const discountInfo =
      product.discounts.length > 0
        ? {
            quantity: product.discounts[0].quantity,
            rate: product.discounts[0].rate,
          }
        : undefined;

    const handleAddToCart = () => {
      if (remainingStock <= 0) {
        addNotification("재고가 부족합니다!", "error");
        return;
      }

      if (cartItem == null) {
        cart.addItem(product);
        addNotification("장바구니에 담았습니다", "success");
        return;
      }

      const success = cartItem.updateQuantity(cartItem.quantity + 1);

      if (success) {
        addNotification("장바구니에 담았습니다", "success");
      } else {
        addNotification(`재고는 ${product.stock}개까지만 있습니다.`, "error");
      }
    };

    return {
      remainingStock,
      discountRate,
      discountInfo,
      handleAddToCart,
    };
  };

  return (
    <div className="lg:col-span-3">
      <section>
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">전체 상품</h2>
          <div className="text-sm text-gray-600">
            총 {products.filteredList.length}개 상품
          </div>
        </div>
        {products.filteredList.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              "{products.searchTerm}"에 대한 검색 결과가 없습니다.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.filteredList.map((product) => {
              const {
                remainingStock,
                discountRate,
                discountInfo,
                handleAddToCart,
              } = getProductCardData(product);

              return (
                <ProductCard
                  key={product.id}
                  name={product.name}
                  description={product.description}
                  priceLabel={product.priceLabel("₩{price}")}
                  isRecommended={product.isRecommended}
                  discountRate={discountRate}
                  discountInfo={discountInfo}
                  remainingStock={remainingStock}
                  onAddToCart={handleAddToCart}
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
