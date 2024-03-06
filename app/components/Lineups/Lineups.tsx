import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Fab,
  List,
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
import { headerAndBottomNavigationHeight } from '../Navigator/Navigator';
import { useFormatMessage } from '../../MyIntlProvider';
import { CustomDivider } from './customDivider';

export interface LineupVariationsProps {
  lineups: Lineup[];
  getPlayerNameById: (id: PlayerId) => string;
}

export const LineupsComponent: React.FC<LineupVariationsProps> = ({
  lineups,
  getPlayerNameById,
}) => {
  const formatMessage = useFormatMessage();
  const lineupFactoryLineups = lineups.map((lineup) => ({
    activePlayers: lineup.activePlayers.map((p) => p.id),
    inactivePlayers: lineup.inactivePlayers.map((p) => p.id),
    variations: lineup.variations,
  }));
  const [dialogOpen, setDialogOpen] = useState(false);

  const [filterFavorites, setFilterFavorites] = useState(false);

  const { favorites, favorize, unfavorize, favoritesFilter, isFavorite } =
    useFavorites();

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
        disabled={filterFavorites}
        active={true}
        onClick={() => removeFilter(filter)}
      />
    );
  });
  const filterDialog = (
    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
      <DialogTitle>{formatMessage('filterDialog.title')}</DialogTitle>
      <DialogContent>
        <FilterChip
          style={{ width: '100%' }}
          key={`filter-favorites`}
          text={formatMessage('lineups.showFavorites')}
          active={filterFavorites}
          disabled={favorites.length === 0}
          onClick={() => {
            setFilterFavorites(!filterFavorites);
          }}
        />
        <CustomDivider>{formatMessage('filterDialog.pairings')}</CustomDivider>
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
              disabled={filterFavorites}
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
        <Button onClick={() => setDialogOpen(false)}>
          {formatMessage('filterDialog.close')}
        </Button>
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
      {filterDialog}
      <div style={{ flex: 1, width: '100%' }}>
        <List>
          {filteredLineups.map((l, index) => (
            <ExpandableLineup
              key={`lineup-${index}`}
              lineup={l}
              getPlayerNameById={getPlayerNameById}
              isFavorite={isFavorite}
              favorize={favorize}
              unfavorize={unfavorize}
            />
          ))}
        </List>
      </div>
      <Fab
        style={{
          position: 'fixed',
          bottom: `calc(${headerAndBottomNavigationHeight} - 28px)`,
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
