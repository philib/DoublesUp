import _, { sortBy, uniqBy } from 'lodash';
import { getPermutations } from './getPermutations';
import { PlayerId } from './RegistrationList';
import { Variation } from './service/RegistrationListService';

export type PairingFilter<T> = {
  player1: T;
  player2: T;
};
export type InactivePairingFilter<T> = {
  filter: PairingFilter<T>;
};
type DoublesPairing<T> = [
  { position: number; value: T },
  { position: number; value: T }
];

export interface Lineup<T> {
  activePlayers: T[];
  inactivePlayers: T[];
  variations: DoublesPairing<T>[][];
}

export const createLineups = <T>(players: T[]): Lineup<T>[] => {
  if (players.length < 6) {
    return [];
  }

  const result = getPermutations(players, 6);
  return _.uniqWith(
    result.map((permutation) => {
      const activePlayers = permutation.map((id) => id);
      const allPossibleLineupVariantions: DoublesPairing<T>[][] =
        allPossibleLineupVariations.map((variation) => {
          return variation.flatMap((doublesPairing) => {
            const a: DoublesPairing<T> = [
              {
                position: doublesPairing[0],
                value: activePlayers[doublesPairing[0] - 1],
              },
              {
                position: doublesPairing[1],
                value: activePlayers[doublesPairing[1] - 1],
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

export const filterLineupsByPairings = <T>(
  lineups: Lineup<T>[],
  filter: { player1: T; player2: T }[],
  equals: (a: T, b: T) => boolean
): Lineup<T>[] => {
  const lineupsWithPlayersPlaying = filter.reduce((acc, filter) => {
    return acc.filter((lineup) => {
      const player1Playing = lineup.activePlayers.find((player) =>
        equals(player, filter.player1)
      );
      const player2Playing = lineup.activePlayers.find((player) =>
        equals(player, filter.player2)
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
            equals(pairing[0].value, filter.player1) &&
            equals(pairing[1].value, filter.player2);
          return newLocal;
        });
      });
    }, lineup.variations),
  }));

  return withFilteredVariations;
};

export const filterLineupsByVariations = <T>(
  lineups: Lineup<PlayerId>[],
  filteredVariations: Variation[]
): Lineup<PlayerId>[] => {
  const isFilteredVariation = filteredVariations.reduce(
    (acc, filter) => {
      return (variation: DoublesPairing<PlayerId>[]) => {
        return (
          acc(variation) ||
          (variation[0][0].value.equals(filter.doubles1.player1) &&
            variation[0][1].value.equals(filter.doubles1.player2) &&
            variation[1][0].value.equals(filter.doubles2.player1) &&
            variation[1][1].value.equals(filter.doubles2.player2) &&
            variation[2][0].value.equals(filter.doubles3.player1) &&
            variation[2][1].value.equals(filter.doubles3.player2))
        );
      };
    },
    (() => {
      return false;
    }) as (pairings: DoublesPairing<PlayerId>[]) => boolean
  );
  const result = lineups
    .map((lineup) => ({
      ...lineup,
      variations: lineup.variations.filter(isFilteredVariation),
    }))
    .filter((lineup) => lineup.variations.length > 0);
  return result;
};

export const getFilterStatus = <T>(
  result: Lineup<T>[],
  equals: (a: T, b: T) => boolean,
  appliedFilters: { player1: T; player2: T }[]
): InactivePairingFilter<T>[] => {
  const variationsMatchingFilters = appliedFilters.reduce(
    (acc, filter) => {
      return acc.filter((variation) => {
        return variation.some((pairing) => {
          const newLocal =
            equals(pairing[0].value, filter.player1) &&
            equals(pairing[1].value, filter.player2);
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
        const newLocal = `${JSON.stringify(it[0].value)} - ${JSON.stringify(
          it[1].value
        )}`;
        return newLocal;
      }
    ),
    [(it) => it[0].position, (it) => it[1].position]
  );
  const remainingVariations = appliedFilters.reduce((acc, filter) => {
    return acc.filter(
      (it) =>
        !(
          equals(it[0].value, filter.player1) &&
          equals(it[1].value, filter.player2)
        )
    );
  }, uniqueVariations);
  return remainingVariations.map((variation) => ({
    filter: {
      player1: variation[0].value,

      player2: variation[1].value,
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
