type BaseOptions = {
  formatZero?: string;
};

type NonPrefixOrSuffixOptions = BaseOptions & {
  type?: undefined;
};

type PrefixOptions = BaseOptions & {
  type: "prefix";
  prefix: string;
};

type SuffixOptions = BaseOptions & {
  type: "suffix";
  suffix: string;
};

export type FormatKRWOptions = NonPrefixOrSuffixOptions | PrefixOptions | SuffixOptions;

export function formatKRW(price: number, options?: FormatKRWOptions) {
  if (price === 0 && options?.formatZero != null) {
    return options.formatZero;
  }

  if (options?.type === "prefix") {
    return `${options.prefix}${price.toLocaleString()}`;
  }

  if (options?.type === "suffix") {
    return `${price.toLocaleString()}${options.suffix}`;
  }

  return `${price.toLocaleString()}원`;
}
