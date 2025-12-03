export function maxBy<T>(array: T[], getMax: (item: T) => number): number {
  let max = { item: array[0], value: getMax(array[0]) };

  for(const item of array) {
    const value = getMax(item);
    if(value > max.value) {
      max = { item, value };
    }
  }

  return max.value;
}
