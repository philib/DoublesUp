export const getPermutations = <T>(
  list: T[],
  elementsPerPermutation: number
): T[][] => {
  const recursiveGetPermutations = <T>(list: T[], result: T[] = []): T[][] => {
    return list.flatMap((element, index) => {
      const nextResult = [...result, element];
      const remaining = list.slice(index + 1);
      const futureResult = recursiveGetPermutations(remaining, nextResult);
      return [nextResult, ...futureResult].filter(
        (permutation) => permutation.length === elementsPerPermutation
      );
    });
  };
  return recursiveGetPermutations(list);
};
