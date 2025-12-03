import { Product } from "../../../../types";

export type ProductWithUI = Product & {
  description?: string;
  isRecommended?: boolean;
};
