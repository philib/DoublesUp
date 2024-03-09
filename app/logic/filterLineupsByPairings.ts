import { Lineup } from './Lineup';
import { PairingFilter } from './PairingFilter';

export const filterLineupsByPairings = <T>(
  lineups: Lineup<T>[],
  filter: PairingFilter<T>[],
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
