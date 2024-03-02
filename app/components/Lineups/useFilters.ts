import { useCallback, useState } from 'react';
import { PlayerId } from '../../RegistrationList';
import {
  filterLineupsByPairings,
  Lineup as LineupFactoryLineup,
} from '../../LineupFactory';

export const useFilters = () => {
  const [filters, setFilters] = useState<
    { player1: PlayerId; player2: PlayerId }[]
  >([]);

  const addFilter = useCallback(
    (filter: { player1: PlayerId; player2: PlayerId }) => {
      const newFilter = [...filters, filter];
      setFilters(newFilter);
    },
    [filters, setFilters]
  );

  const removeFilter = useCallback(
    (filter: { player1: PlayerId; player2: PlayerId }) => {
      const newFilter = filters.filter((f) => f !== filter);
      setFilters(newFilter);
    },
    [filters, setFilters]
  );
  const filter = useCallback(
    (lineups: LineupFactoryLineup<PlayerId>[]) => {
      return filterLineupsByPairings(lineups, filters, (a, b) => a.equals(b));
    },
    [filters]
  );
  return {
    filters,
    filter,
    addFilter,
    removeFilter,
  };
};
