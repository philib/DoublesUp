import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Fab,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { PlayerId } from '../../logic/RegistrationList';
import { getFilterStatus } from '@/app/logic/getFilterStatus';
import { Lineup as LineupFactoryLineup } from '@/app/logic/Lineup';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { FilterChip } from './FilterChip';
import { useFilters } from './useFilters';
import { useFavorites } from './useFavorites';
import { ExpandableLineup } from './ExpandableLineup';
import { Lineup } from './VariationComponent';
import { headerAndBottomNavigationHeight } from '../Navigator/Navigator';
import { useFormatMessage } from '../../MyIntlProvider';
import { CustomDivider } from './customDivider';
import { Virtuoso } from 'react-virtuoso';

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
  useEffect(() => {
    if (favorites.length === 0) {
      setFilterFavorites(false);
    }
  }, [favorites]);
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
  const renderRow = (index: number) => {
    const l = filteredLineups[index];
    return (
      <ExpandableLineup
        key={`lineup-${index}`}
        lineup={l}
        getPlayerNameById={getPlayerNameById}
        isFavorite={isFavorite}
        favorize={favorize}
        unfavorize={unfavorize}
      />
    );
  };
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {filterDialog}
      <Virtuoso
        style={{ height: '100%', width: '100%' }}
        totalCount={filteredLineups.length}
        itemContent={renderRow}
      />
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
