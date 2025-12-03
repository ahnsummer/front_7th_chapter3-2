import { useState, useCallback } from "react";
import { ProductsService } from "../../../domains/products/hooks/useProducts";
import { ProductWithUI } from "../../../domains/products/types/ProductWithUI";
import { addNotification } from "../../../domains/notifications/utils/addNotification";
import { ProductList } from "./ProductList/ProductList";
import { ProductForm } from "./ProductForm/ProductForm";

type ProductsSectionProps = {
  products: ProductsService;
};

export function ProductsSection({ products }: ProductsSectionProps) {
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    price: 0,
    stock: 0,
    description: "",
    discounts: [] as Array<{ quantity: number; rate: number }>,
  });
  const [showProductForm, setShowProductForm] = useState(false);

  const addProduct = useCallback((newProduct: Omit<ProductWithUI, "id">) => {
    const product: ProductWithUI = {
      ...newProduct,
      id: `p${Date.now()}`,
    };

    products.addItem(product);
    addNotification("상품이 추가되었습니다.", "success");
  }, [products]);

  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      products.getById(productId)?.update(updates);
      addNotification("상품이 수정되었습니다.", "success");
    },
    [products]
  );

  const deleteProduct = useCallback((productId: string) => {
    products.getById(productId)?.delete();
    addNotification("상품이 삭제되었습니다.", "success");
  }, [products]);

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct !== "new") {
      updateProduct(editingProduct, productForm);
      setEditingProduct(null);
    } else {
      addProduct({
        ...productForm,
        discounts: productForm.discounts,
      });
    }
    setProductForm({
      name: "",
      price: 0,
      stock: 0,
      description: "",
      discounts: [],
    });
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const startEditProduct = (product: ProductWithUI) => {
    setEditingProduct(product.id);
    setProductForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || "",
      discounts: product.discounts || [],
    });
    setShowProductForm(true);
  };

  const handleFormCancel = () => {
    setEditingProduct(null);
    setProductForm({
      name: "",
      price: 0,
      stock: 0,
      description: "",
      discounts: [],
    });
    setShowProductForm(false);
  };

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">상품 목록</h2>
          <button
            onClick={() => {
              setEditingProduct("new");
              setProductForm({
                name: "",
                price: 0,
                stock: 0,
                description: "",
                discounts: [],
              });
              setShowProductForm(true);
            }}
            className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800">
            새 상품 추가
          </button>
        </div>
      </div>

      <ProductList
        products={products}
        onEdit={startEditProduct}
        onDelete={deleteProduct}
      />

      {showProductForm && (
        <ProductForm
          editingProduct={editingProduct}
          productForm={productForm}
          onFormChange={(updates) =>
            setProductForm((prev) => ({ ...prev, ...updates }))
          }
          onSubmit={handleProductSubmit}
          onCancel={handleFormCancel}
        />
      )}
    </section>
  );
}

