import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
} from '@mui/material';
import { CustomDivider } from '../customDivider';
import { ReactNode, useEffect, useState } from 'react';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { PlayerId } from '../RegistrationList';
import {
  filterLineupsByPairings,
  filterLineupsByVariations,
  getFilterStatus,
  Lineup as LineupFactoryLineup,
} from '../LineupFactory';
import {
  Variation as TestVariation,
  isEqual,
} from '../service/RegistrationListService';
import { CustomFab } from '../components/CustomFab';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

export type Variation = [
  { position: number; id: PlayerId },
  { position: number; id: PlayerId }
][];
export interface Lineup {
  activePlayers: { id: PlayerId }[];
  inactivePlayers: { id: PlayerId }[];
  variations: Variation[];
}
export interface LineupVariationsProps {
  lineups: Lineup[];
  getPlayerNameById: (id: PlayerId) => string;
}

const VariationComponent: React.FC<{
  variation: Variation;
  getPlayerNameById: (id: PlayerId) => string;
  isFavorite: boolean;
  favorize: () => void;
  unfavorize: () => void;
}> = ({ variation, getPlayerNameById, favorize, unfavorize, isFavorite }) => {
  return (
    <Grid item container direction={'row'}>
      <Grid item>
        {isFavorite ? (
          <IconButton
            aria-label="star"
            onClick={() => {
              unfavorize();
            }}
          >
            <StarIcon color={'primary'} />
          </IconButton>
        ) : (
          <IconButton
            aria-label="unstar"
            onClick={() => {
              favorize();
            }}
          >
            <StarBorderIcon color={'primary'} />
          </IconButton>
        )}
      </Grid>
      <Grid item>
        <Grid item container direction={'column'}>
          {variation.map((doublesPairing, index) => (
            <Grid
              key={`variation-${index}`}
              item
              container
              direction={'row'}
              spacing={2}
              alignItems={'center'}
            >
              <Grid item key={index}>
                {`(${doublesPairing
                  .map((player) => player.position)
                  .join(' + ')} = ${doublesPairing.reduce(
                  (acc, cur) => acc + cur.position,
                  0
                )}) `}
                {doublesPairing
                  .map((player) => getPlayerNameById(player.id))
                  .join(' + ')}
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};
const ExpandableLineup: React.FC<{
  lineupVariation: number;
  lineup: LineupFactoryLineup;
  getPlayerNameById: (id: PlayerId) => string;
  favorize: (f: TestVariation) => void;
  unfavorize: (f: TestVariation) => void;
  isFavorite: (f: TestVariation) => boolean;
}> = ({
  lineupVariation,
  lineup: { activePlayers, inactivePlayers, variations },
  getPlayerNameById,
  favorize,
  unfavorize,
  isFavorite,
}) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <LineupCard>
        <CardContent>
          <CardHeader
            onClick={() => setExpanded(!expanded)}
            title={'Lineup #' + lineupVariation}
            subheader={
              <>
                <div>
                  With:
                  {activePlayers.map((p) => getPlayerNameById(p)).join(' ,')}
                </div>
                <div>
                  Without:
                  {inactivePlayers.map((p) => getPlayerNameById(p)).join(' ,')}
                </div>
              </>
            }
          />
          {expanded &&
            variations.map((v, index) => {
              const favorite: TestVariation = {
                doubles1: {
                  player1: v[0][0].id,
                  player2: v[0][1].id,
                },
                doubles2: {
                  player1: v[1][0].id,
                  player2: v[1][1].id,
                },
                doubles3: {
                  player1: v[2][0].id,
                  player2: v[2][1].id,
                },
              };
              return (
                <div key={`variant ${index}`}>
                  <CustomDivider>Variant {index + 1}</CustomDivider>
                  <VariationComponent
                    variation={v}
                    getPlayerNameById={getPlayerNameById}
                    favorize={() => favorize(favorite)}
                    unfavorize={() => unfavorize(favorite)}
                    isFavorite={isFavorite(favorite)}
                  />
                </div>
              );
            })}
        </CardContent>
      </LineupCard>
    </>
  );
};

const useFilters = () => {
  const [filters, setFilters] = useState<
    { player1: PlayerId; player2: PlayerId }[]
  >([]);

  return {
    filters,
    filter: (lineups: LineupFactoryLineup[]) => {
      return filterLineupsByPairings(lineups, filters);
    },
    addFilter: (filter: { player1: PlayerId; player2: PlayerId }) => {
      const newFilter = [...filters, filter];
      setFilters(newFilter);
    },
    removeFilter: (filter: { player1: PlayerId; player2: PlayerId }) => {
      const newFilter = filters.filter((f) => f !== filter);
      setFilters(newFilter);
    },
  };
};

const useFavorites = () => {
  const [favorites, setFavorites] = useState<TestVariation[]>([]);
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
    favoritesFilter: (lineups: LineupFactoryLineup[]) => {
      return filterLineupsByVariations(lineups, favorites);
    },
  };
};

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

  const { favorites, favorize, unfavorize, favoritesFilter, isFavorite } =
    useFavorites();

  const { filters, filter, addFilter, removeFilter } = useFilters();
  const [activeFilter, setActiveFilter] = useState<
    (f: LineupFactoryLineup[]) => LineupFactoryLineup[]
  >(() => filter);
  useEffect(() => {
    setActiveFilter(
      () => (f: LineupFactoryLineup[]) =>
        filterFavorites ? favoritesFilter(filter(f)) : filter(f)
    );
  }, [filters, filterFavorites, favorites]);
  const filteredLineups = activeFilter(lineupFactoryLineups);
  const visibleVariationsLength = filteredLineups.flatMap(
    (lineup) => lineup.variations
  ).length;

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
        {getFilterStatus(lineupFactoryLineups, filters).map((filter) => {
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
        height: '100vh',
        alignItems: 'center',
      }}
    >
      {filterDialog}
      <div
        style={{
          overflow: 'auto',
          whiteSpace: 'nowrap',
          scrollbarWidth: 'none',
        }}
      >
        <FilterChip
          key={`filter-favorites`}
          text={'Show Favorites'}
          active={filterFavorites}
          onClick={() => {
            setFilterFavorites(!filterFavorites);
          }}
        />
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>
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
      <div
        style={{
          zIndex: 1,
          position: 'fixed',
          bottom: 0,
          transform: 'translate(0%, -67%)',
        }}
      >
        <CustomFab
          onClick={() => {
            setDialogOpen(!dialogOpen);
          }}
        >
          <FilterAltIcon />
        </CustomFab>
      </div>
    </div>
  );
};

const LineupCard: React.FC<{ children: ReactNode | ReactNode[] }> = ({
  children,
}) => <Card style={{ margin: '10px' }}>{children}</Card>;

const FilterChip: React.FC<{
  text: string;
  active: boolean;
  onClick: () => void;
}> = ({ text, active, onClick }) => {
  const variant = active ? ('filled' as const) : ('outlined' as const);
  return (
    <Chip
      style={{
        marginTop: '10px',
        marginBottom: '10px',
        marginLeft: '5px',
        marginRight: '5px',
      }}
      variant={variant}
      color="primary"
      label={text}
      onClick={onClick}
    />
  );
};
