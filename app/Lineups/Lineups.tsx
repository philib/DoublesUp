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
  getFilterStatus,
  Lineup as LineupFactoryLineup,
} from '../LineupFactory';
import { set } from 'lodash';

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
}> = ({ variation, getPlayerNameById }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  return (
    <Grid item container direction={'row'}>
      <Grid item>
        {isFavorite ? (
          <IconButton
            aria-label="star"
            onClick={() => {
              setIsFavorite(false);
            }}
          >
            <StarIcon color={'primary'} />
          </IconButton>
        ) : (
          <IconButton
            aria-label="unstar"
            onClick={() => {
              setIsFavorite(true);
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
}> = ({
  lineupVariation,
  lineup: { activePlayers, inactivePlayers, variations },
  getPlayerNameById,
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
            variations.map((v, index) => (
              <>
                <CustomDivider>Variant {index + 1}</CustomDivider>
                <VariationComponent
                  variation={v}
                  getPlayerNameById={getPlayerNameById}
                />
              </>
            ))}
        </CardContent>
      </Card>
    </>
  );
};

const useFilters = (lineups: LineupFactoryLineup[]) => {
  const [filters, setFilters] = useState<
    { player1: PlayerId; player2: PlayerId }[]
  >([]);
  const [filteredLineups, setFilteredLineups] =
    useState<LineupFactoryLineup[]>(lineups);
  useEffect(() => {
    const newFilteredLineups = filterLineupsByPairings(lineups, filters);
    setFilteredLineups(newFilteredLineups);
  }, [filters]);
  return {
    filters,
    filteredLineups,
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

export const LineupsComponent: React.FC<LineupVariationsProps> = ({
  lineups,
  getPlayerNameById,
}) => {
  const lineupFactoryLineups = lineups.map((lineup) => ({
    activePlayers: lineup.activePlayers.map((p) => p.id),
    inactivePlayers: lineup.inactivePlayers.map((p) => p.id),
    variations: lineup.variations,
  }));
  const { filters, filteredLineups, addFilter, removeFilter } =
    useFilters(lineupFactoryLineups);
  return (
    <>
      {filteredLineups.flatMap((lineup) => lineup.variations).length}
      {filters.map((filter) => {
        return (
          <FilterChip
            text={`${getPlayerNameById(filter.player1)} + ${getPlayerNameById(
              filter.player2
            )}`}
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
      {filteredLineups.map((l, index) => (
        <ExpandableLineup
          lineupVariation={index + 1}
          lineup={l}
          getPlayerNameById={getPlayerNameById}
        />
      ))}
    </>
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
      style={{ width: '100%' }}
      variant={style.variant}
      color={style.color}
      label={text}
      onClick={onClick}
    />
  );
};
