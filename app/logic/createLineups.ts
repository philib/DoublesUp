import _ from 'lodash';
import { getPermutations } from './getPermutations';
import { Lineup } from './Lineup';
import { DoublesPairing } from './DoublesPairing';
import { allLineupVariations } from './AllLineupVariations';

export const createLineupsFor6Players = <T>(players: T[]): Lineup<T>[] =>
  createLineupsInternal(players, 6);

export const createLineupsFor4Players = <T>(players: T[]): Lineup<T>[] =>
  createLineupsInternal(players, 4);

const createLineupsInternal = <T>(players: T[], size: 4 | 6): Lineup<T>[] => {
  if (players.length < size) {
    return [];
  }

  const result = getPermutations(players, size);
  return _.uniqWith(
    result.map((permutation) => {
      const activePlayers = permutation.map((id) => id);
      const allPossibleLineupVariantions: DoublesPairing<{
        position: number;
        value: T;
      }>[][] = allLineupVariations[size].map((variation) => {
        return variation.flatMap((doublesPairing) => {
          const a: DoublesPairing<{ position: number; value: T }> = [
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
