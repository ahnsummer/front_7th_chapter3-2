import { useState } from "react";
import { useDebounce } from "../../../shared/hooks/useDebounce";
import { useLocalStorage } from "../../../shared/hooks/useLocalStorage";
import { initialProducts } from "../constants/initialProducts";
import { ProductWithUI } from "../types/ProductWithUI";
import { formatProductPrice } from "../utils/formatProductPrice";

type ProductItemInstance = ProductWithUI & {
  priceLabel: (type?: "₩{price}" | "{price}원") => string;

  update: (updates: Partial<ProductWithUI>) => void;
  delete: () => void;
};

export type ProductsService = {
  list: ProductItemInstance[];
  filteredList: ProductItemInstance[];
  searchTerm: string;

  getById: (productId: string) => ProductItemInstance | undefined;
  addItem: (product: ProductWithUI) => void;
  search: (term: string) => void;
};

export function useProducts(): ProductsService {
  const [products, setProducts] = useLocalStorage<ProductWithUI[]>(
    "products",
    initialProducts
  );

  const productInstance: ProductItemInstance[] = products.map(
    (product, idx) => {
      return {
        ...product,
        priceLabel: (type = "{price}원") =>
          formatProductPrice(product, {
            formatOptions:
              type === "₩{price}"
                ? { type: "prefix", prefix: "₩" }
                : { type: "suffix", suffix: "원" },
          }),
        update: (updates: Partial<ProductWithUI>) => {
          setProducts((prev) => {
            prev[idx] = { ...prev[idx], ...updates };
            return [...prev];
          });
        },
        delete: () => {
          setProducts((prev) => prev.filter((_, i) => i !== idx));
        },
      };
    }
  );

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const filteredProducts =
    debouncedSearchTerm !== ""
      ? productInstance.filter(
          (product) =>
            product.name
              .toLowerCase()
              .includes(debouncedSearchTerm.toLowerCase()) ||
            (product.description &&
              product.description
                .toLowerCase()
                .includes(debouncedSearchTerm.toLowerCase()))
        )
      : productInstance;

  const getById = (productId: string) => {
    return productInstance.find((product) => product.id === productId);
  };

  const addItem = (product: ProductWithUI) => {
    setProducts((prev) => [...prev, product]);
  };

  const search = (term: string) => {
    setSearchTerm(term);
  };

  return {
    list: productInstance,
    filteredList: filteredProducts,
    searchTerm,

    getById,
    addItem,
    search,
  };
}
