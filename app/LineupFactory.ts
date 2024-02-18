import _, { sortBy, uniqBy } from 'lodash';
import { getPermutations } from './getPermutations';
import { PlayerId } from './RegistrationList';

export type PairingFilter = {
  player1: PlayerId;
  player2: PlayerId;
};
export type InactivePairingFilter = {
  filter: PairingFilter;
};
type DoublesPairing = [
  { position: number; id: PlayerId },
  { position: number; id: PlayerId }
];

export interface Lineup {
  activePlayers: PlayerId[];
  inactivePlayers: PlayerId[];
  variations: DoublesPairing[][];
}

export const createLineups = (players: {
  [rank: number]: PlayerId;
}): 'Not enough players' | Lineup[] => {
  if (Object.values(players).length < 6) {
    return 'Not enough players';
  }

  const result = getPermutations(Object.entries(players), 6);
  return _.uniqWith(
    result.map((permutation) => {
      const activePlayers = permutation.map(([_, id]) => id);
      const allPossibleLineupVariantions: DoublesPairing[][] =
        allPossibleLineupVariations.map((variation) => {
          return variation.flatMap((doublesPairing) => {
            const a: DoublesPairing = [
              {
                position: doublesPairing[0],
                id: activePlayers[doublesPairing[0] - 1],
              },
              {
                position: doublesPairing[1],
                id: activePlayers[doublesPairing[1] - 1],
              },
            ];
            return [a];
          });
        });
      const inactivePlayers = Object.values(players).filter(
        (p) => !activePlayers.includes(p)
      );
      return {
        activePlayers,
        inactivePlayers,
        variations: allPossibleLineupVariantions,
      };
    }),
    (a, b) => _.isEqual(a.activePlayers, b.activePlayers)
  );
};

export const filterLineupsByPairings = (
  lineups: Lineup[],
  filter: { player1: PlayerId; player2: PlayerId }[]
): Lineup[] => {
  const lineupsWithPlayersPlaying = filter.reduce((acc, filter) => {
    return acc.filter((lineup) => {
      const player1Playing = lineup.activePlayers.find((player) =>
        player.equals(filter.player1)
      );
      const player2Playing = lineup.activePlayers.find((player) =>
        player.equals(filter.player2)
      );
      return player1Playing && player2Playing;
    });
  }, lineups);

  const withFilteredVariations = lineupsWithPlayersPlaying.map((lineup) => ({
    ...lineup,
    variations: filter.reduce((acc, filter) => {
      return acc.filter((variation) => {
        return variation.some((pairing) => {
          const newLocal =
            pairing[0].id.equals(filter.player1) &&
            pairing[1].id.equals(filter.player2);
          return newLocal;
        });
      });
    }, lineup.variations),
  }));

  return withFilteredVariations;
};

export const getFilterStatus = (
  result: Lineup[],
  appliedFilters: { player1: PlayerId; player2: PlayerId }[]
): InactivePairingFilter[] => {
  const variationsMatchingFilters = appliedFilters.reduce(
    (acc, filter) => {
      return acc.filter((variation) => {
        return variation.some((pairing) => {
          const newLocal =
            pairing[0].id.equals(filter.player1) &&
            pairing[1].id.equals(filter.player2);
          return newLocal;
        });
      });
    },
    result.flatMap((it) => it.variations)
  );

  const uniqueVariations = sortBy(
    uniqBy(
      variationsMatchingFilters.flatMap((it) => it),
      (it) => {
        // const newLocal = `${it[0].position} ${it[0].id.value} - ${it[1].position} ${it[1].id.value}`;
        const newLocal = `${it[0].id.value} - ${it[1].id.value}`;
        return newLocal;
      }
    ),
    [(it) => it[0].position, (it) => it[1].position]
  );
  const remainingVariations = appliedFilters.reduce((acc, filter) => {
    return acc.filter(
      (it) =>
        !(it[0].id.equals(filter.player1) && it[1].id.equals(filter.player2))
    );
  }, uniqueVariations);
  return remainingVariations.map((variation) => ({
    filter: {
      player1: variation[0].id,

      player2: variation[1].id,
    },
  }));
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
