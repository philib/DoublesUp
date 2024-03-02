import { useCallback, useState } from 'react';
import {
  filterLineupsByVariations,
  Lineup as LineupFactoryLineup,
} from '../../LineupFactory';
import {
  Variation as TestVariation,
  isEqual,
} from '../../service/RegistrationListService';
import { PlayerId } from '../../RegistrationList';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<TestVariation[]>([]);
  const favoritesFilter = useCallback(
    (lineups: LineupFactoryLineup<PlayerId>[]) => {
      return filterLineupsByVariations(lineups, favorites);
    },
    [favorites]
  );
  return {
    favorites,
    isFavorite: (f: TestVariation) => {
      const equal = isEqual(f);
      return favorites.find(equal) !== undefined;
    },
    favorize: (f: TestVariation) => {
      setFavorites([...favorites, f]);
    },
    unfavorize: (f: TestVariation) => {
      const equal = isEqual(f);
      setFavorites(favorites.filter((fav) => !equal(fav)));
    },
    favoritesFilter,
  };
};
