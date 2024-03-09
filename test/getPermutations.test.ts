import { getPermutations } from '../app/logic/getPermutations';

describe('getPermutations', () => {
  test('for less then given element return empty array', () => {
    //given
    const list = [1, 2, 3];
    const elementsPerPermutation = 4; //when
    const result = getPermutations(list, elementsPerPermutation);
    //then
    expect(result).toEqual([]);
  });
  test('for exact number return array', () => {
    //given
    const list = [1, 2, 3];
    const elemenstPerPermutation = 3;
    //when
    const result = getPermutations(list, elemenstPerPermutation);
    //then
    expect(result).toEqual([[1, 2, 3]]);
  });
  test('for one more then given elements return permuations', () => {
    //given
    const list = [1, 2, 3, 4];
    const elementsPerPermuation = 3;
    //when
    const result = getPermutations(list, elementsPerPermuation);
    //then
    expect(result).toEqual([
      [1, 2, 3],
      [1, 2, 4],
      [1, 3, 4],
      [2, 3, 4],
    ]);
  });
  test('for two more then given elements return permuations', () => {
    //given
    const list = [1, 2, 3, 4, 5];
    const elementsPerPermuation = 3;
    //when
    const result = getPermutations(list, elementsPerPermuation);
    //then
    expect(result).toEqual([
      [1, 2, 3],
      [1, 2, 4],
      [1, 2, 5],
      [1, 3, 4],
      [1, 3, 5],
      [1, 4, 5],
      [2, 3, 4],
      [2, 3, 5],
      [2, 4, 5],
      [3, 4, 5],
    ]);
  });
});
