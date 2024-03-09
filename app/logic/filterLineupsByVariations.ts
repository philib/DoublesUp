import { PlayerId } from './RegistrationList';
import { Lineup } from './Lineup';
import { DoublesPairing } from './DoublesPairing';

export const filterLineupsByVariations = <T>(
  lineups: Lineup<PlayerId>[],
  filteredVariations: DoublesPairing<PlayerId>[][]
): Lineup<PlayerId>[] => {
  const isFilteredVariation = filteredVariations.reduce(
    (acc, filter) => {
      return (variation: DoublesPairing<{ value: PlayerId }>[]) => {
        return (
          acc(variation) ||
          variation.every(
            (pairing, index) =>
              pairing[0].value.equals(filter[index][0]) &&
              pairing[1].value.equals(filter[index][1])
          )
        );
      };
    },
    (() => {
      return false;
    }) as (pairings: DoublesPairing<{ value: PlayerId }>[]) => boolean
  );
  const result = lineups
    .map((lineup) => ({
      ...lineup,
      variations: lineup.variations.filter(isFilteredVariation),
    }))
    .filter((lineup) => lineup.variations.length > 0);
  return result;
};
