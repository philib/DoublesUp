import {
  Card,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  IconButton,
} from '@mui/material';
import { CustomDivider } from '../customDivider';
import { useEffect, useState } from 'react';
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
      <Card style={{ margin: '10px' }}>
        <CardContent>
          <CardHeader
            onClick={() => setExpanded(!expanded)}
            title={'Lineup #' + lineupVariation}
            subheader={
              <>
                <div>
                  With:{' '}
                  {activePlayers.map((p) => getPlayerNameById(p)).join(' ,')}
                </div>
                <div>
                  Without:{' '}
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
      </Card>
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
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div
        style={{
          overflow: 'auto',
          whiteSpace: 'nowrap',
          scrollbarWidth: 'none',
        }}
      >
        {
          activeFilter(lineupFactoryLineups).flatMap(
            (lineup) => lineup.variations
          ).length
        }
        <FilterChip
          key={`filter-favorites`}
          text={'Filters Favorites'}
          active={filterFavorites}
          onClick={() => {
            setFilterFavorites(!filterFavorites);
          }}
        />
        {filters.map((filter, index) => {
          const text = `${getPlayerNameById(
            filter.player1
          )} + ${getPlayerNameById(filter.player2)}`;
          return (
            <FilterChip
              key={`filter-active-${text}`}
              text={text}
              active={true}
              onClick={() => removeFilter(filter)}
            />
          );
        })}
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
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        {activeFilter(lineupFactoryLineups).map((l, index) => (
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
    </div>
  );
};

const FilterChip: React.FC<{
  text: string;
  active: boolean;
  onClick: () => void;
}> = ({ text, active, onClick }) => {
  const style: {
    variant: 'filled' | 'outlined';
    color: 'default' | 'primary';
  } = active
    ? { variant: 'filled', color: 'primary' }
    : { variant: 'outlined', color: 'primary' };
  return (
    <Chip
      style={{
        marginTop: '10px',
        marginBottom: '10px',
        marginLeft: '5px',
        marginRight: '5px',
      }}
      variant={style.variant}
      color={style.color}
      label={text}
      onClick={onClick}
    />
  );
};
