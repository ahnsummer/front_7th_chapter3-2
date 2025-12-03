export function sum(array: number[]): number {
  return array.reduce((acc, curr) => acc + curr, 0);
}

export function sumBy<T>(array: T[], getSum: (item: T) => number): number {
  return array.reduce((acc, curr) => acc + getSum(curr), 0);
}
