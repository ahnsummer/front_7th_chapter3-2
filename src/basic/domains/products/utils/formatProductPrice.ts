import { formatKRW, FormatKRWOptions } from "../../../shared/utils/formatKRW";
import { ProductWithUI } from "../types/ProductWithUI";

type FormatProductPriceOptions = {
  formatOptions?: FormatKRWOptions;
};

export function formatProductPrice(
  product: ProductWithUI,
  options?: FormatProductPriceOptions
) {
  const { formatOptions } = options ?? {};

  if (product.stock <= 0) {
    return "SOLD OUT";
  }
  return formatKRW(
    product.price,
    formatOptions ?? { type: "suffix", suffix: "원" }
  );
}
