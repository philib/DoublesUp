import { useCallback, useState } from 'react';
import { filterLineupsByVariations } from '../../logic/filterLineupsByVariations';
import { Lineup as LineupFactoryLineup } from '../../logic/Lineup';
import {
  Variation as TestVariation,
  isEqual,
} from '../../service/RegistrationListService';
import { PlayerId } from '../../logic/RegistrationList';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<TestVariation[]>([]);
  const favoritesFilter = useCallback(
    (lineups: LineupFactoryLineup<PlayerId>[]) => {
      return filterLineupsByVariations(
        lineups,
        favorites.map((f) => f.map((it) => [it.player1, it.player2]))
      );
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
