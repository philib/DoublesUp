import {
  Button,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Fab,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { PlayerId } from '../../RegistrationList';
import {
  getFilterStatus,
  Lineup as LineupFactoryLineup,
} from '../../LineupFactory';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { LineupCard } from './LineupCard';
import { FilterChip } from './FilterChip';
import { useFilters } from './useFilters';
import { useFavorites } from './useFavorites';
import { ExpandableLineup } from './ExpandableLineup';
import { Lineup } from './VariationComponent';

export interface LineupVariationsProps {
  lineups: Lineup[];
  getPlayerNameById: (id: PlayerId) => string;
}

export const LineupsComponent: React.FC<LineupVariationsProps> = ({
  lineups,
  getPlayerNameById,
}) => {
  const lineupFactoryLineups = lineups.map((lineup) => ({
    activePlayers: lineup.activePlayers.map((p) => p.id),
    inactivePlayers: lineup.inactivePlayers.map((p) => p.id),
    variations: lineup.variations,
  }));
  const [dialogOpen, setDialogOpen] = useState(false);

  const [filterFavorites, setFilterFavorites] = useState(false);

  const { favorize, unfavorize, favoritesFilter, isFavorite } = useFavorites();

  const { filters, filter, addFilter, removeFilter } = useFilters();
  const [activeFilter, setActiveFilter] = useState<
    (f: LineupFactoryLineup<PlayerId>[]) => LineupFactoryLineup<PlayerId>[]
  >(() => filter);
  useEffect(() => {
    setActiveFilter(
      () => (f: LineupFactoryLineup<PlayerId>[]) =>
        filterFavorites ? favoritesFilter(f) : filter(f)
    );
  }, [filterFavorites, favoritesFilter, filter]);
  const filteredLineups = activeFilter(lineupFactoryLineups);

  const activeFilters = filters.map((filter, index) => {
    const text = `${getPlayerNameById(filter.player1)} + ${getPlayerNameById(
      filter.player2
    )}`;
    return (
      <FilterChip
        key={`filter-active-${text}`}
        text={text}
        active={true}
        onClick={() => removeFilter(filter)}
      />
    );
  });
  const filterDialog = (
    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
      <DialogTitle>Choose Filter</DialogTitle>
      <DialogContent>
        {activeFilters.length > 0 && (
          <>
            {activeFilters}
            <Divider style={{ margin: '10px' }} />
          </>
        )}
        {getFilterStatus(
          lineupFactoryLineups,
          (a, b) => a.equals(b),
          filters
        ).map((filter) => {
          const text = `${getPlayerNameById(
            filter.filter.player1
          )} + ${getPlayerNameById(filter.filter.player2)}`;
          return (
            <FilterChip
              key={`filter-inactive-${text}`}
              text={text}
              active={false}
              onClick={() =>
                addFilter({
                  player1: filter.filter.player1,
                  player2: filter.filter.player2,
                })
              }
            />
          );
        })}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDialogOpen(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  );
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <FilterChip
        style={{
          position: 'fixed',
          top: '5rem',
        }}
        key={`filter-favorites`}
        text={'Show Favorites'}
        active={filterFavorites}
        onClick={() => {
          setFilterFavorites(!filterFavorites);
        }}
      />
      {filterDialog}
      <div style={{ flex: 1, overflow: 'auto', width: '100%' }}>
        {filteredLineups.length === 0 && (
          <LineupCard>
            <CardHeader title={'Nothing to see here'} />
            <CardContent>No variation matches your given filter</CardContent>
          </LineupCard>
        )}
        {filteredLineups.map((l, index) => (
          <ExpandableLineup
            key={`lineup-${index}`}
            lineupVariation={index + 1}
            lineup={l}
            getPlayerNameById={getPlayerNameById}
            isFavorite={isFavorite}
            favorize={favorize}
            unfavorize={unfavorize}
          />
        ))}
      </div>
      <Fab
        style={{
          position: 'fixed',
          bottom: '35px',
          borderRadius: '50%',
        }}
        color="primary"
        aria-label="add"
        onClick={() => {
          setDialogOpen(!dialogOpen);
        }}
      >
        <FilterAltIcon />
      </Fab>
    </div>
  );
};
