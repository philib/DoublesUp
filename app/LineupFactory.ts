type DoublesPairing = [
  { position: number; name: string },
  { position: number; name: string }
];

export interface Lineup {
  activePlayers: string[];
  inactivePlayers: string[];
  variations: DoublesPairing[][];
}

export const createLineups = (players: {
  [rank: number]: string;
}): 'Not enough players' | Lineup[] => {
  if (Object.values(players).length < 6) {
    return 'Not enough players';
  }

  const result = generatePermutations(Object.entries(players));
  return result.map((permutation) => {
    const activePlayers = permutation.map(([position, name]) => name);
    const allPossibleLineupVariantions: DoublesPairing[][] =
      allPossibleLineupVariations.map((variation) => {
        return variation.flatMap((doublesPairing) => {
          const a: DoublesPairing = [
            {
              position: doublesPairing[0],
              name: activePlayers[doublesPairing[0] - 1],
            },
            {
              position: doublesPairing[1],
              name: activePlayers[doublesPairing[1] - 1],
            },
          ];
          return [a];
        });
      });
    return {
      activePlayers,
      inactivePlayers: Object.values(players).filter(
        (p) => !activePlayers.includes(p)
      ),
      variations: allPossibleLineupVariantions,
    };
  });
};

const allPossibleLineupVariations = [
  [
    [1, 2],
    [3, 4],
    [5, 6],
  ],
  [
    [1, 2],
    [3, 5],
    [4, 6],
  ],
  [
    [1, 2],
    [3, 6],
    [4, 5],
  ],
  [
    [1, 2],
    [4, 5],
    [3, 6],
  ],
  [
    [1, 3],
    [2, 4],
    [5, 6],
  ],
  [
    [1, 3],
    [2, 5],
    [4, 6],
  ],
  [
    [1, 3],
    [2, 6],
    [4, 5],
  ],
  [
    [1, 4],
    [2, 3],
    [5, 6],
  ],
  [
    [1, 4],
    [2, 5],
    [3, 6],
  ],
  [
    [1, 4],
    [2, 6],
    [3, 5],
  ],
  [
    [1, 4],
    [3, 5],
    [2, 6],
  ],
  [
    [1, 5],
    [2, 4],
    [3, 6],
  ],
  [
    [1, 5],
    [3, 4],
    [2, 6],
  ],
  [
    [1, 6],
    [2, 5],
    [3, 4],
  ],
  [
    [1, 6],
    [3, 4],
    [2, 5],
  ],
  [
    [2, 3],
    [1, 4],
    [5, 6],
  ],
  [
    [2, 3],
    [1, 5],
    [4, 6],
  ],
  [
    [2, 3],
    [1, 6],
    [4, 5],
  ],
  [
    [2, 4],
    [1, 5],
    [3, 6],
  ],
  [
    [2, 4],
    [1, 6],
    [3, 5],
  ],
  [
    [2, 5],
    [1, 6],
    [3, 4],
  ],
  [
    [3, 4],
    [1, 6],
    [2, 5],
  ],
];

function combinations<T>(arr: T[], r: number): T[][] {
  const result: T[][] = [];

  function helper(temp: T[], start: number, depth: number) {
    if (depth === r) {
      result.push([...temp]);
      return;
    }

    for (let i = start; i < arr.length; i++) {
      temp.push(arr[i]);
      helper(temp, i + 1, depth + 1);
      temp.pop();
    }
  }

  helper([], 0, 0);
  return result;
}

function generatePermutations<T>(arr: T[]): T[][] {
  if (arr.length === 6) {
    return [arr];
  }
  const permutations: T[][] = [];

  for (let i = 0; i < arr.length; i++) {
    const remaining = arr.slice(0, i).concat(arr.slice(i + 1));
    const combos = combinations(remaining, 6);
    permutations.push(...combos);
  }

  return permutations;
}
