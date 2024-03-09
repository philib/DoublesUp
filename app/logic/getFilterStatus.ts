import { sortBy, uniqBy } from 'lodash';
import { Lineup } from './Lineup';
import { InactivePairingFilter, PairingFilter } from './PairingFilter';

export const getFilterStatus = <T>(
  result: Lineup<T>[],
  equals: (a: T, b: T) => boolean,
  appliedFilters: PairingFilter<T>[]
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
