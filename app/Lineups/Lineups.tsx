import { Card, CardContent, CardHeader, Grid, IconButton } from '@mui/material';
import { CustomDivider } from '../customDivider';
import { useState } from 'react';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { set } from 'lodash';
import { PlayerId } from '../RegistrationList';

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
  lineup: Lineup;
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
                  {activePlayers.map((p) => getPlayerNameById(p.id)).join(' ,')}
                </div>
                <div>
                  Without:{' '}
                  {inactivePlayers
                    .map((p) => getPlayerNameById(p.id))
                    .join(' ,')}
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

export const LineupsComponent: React.FC<LineupVariationsProps> = ({
  lineups,
  getPlayerNameById,
}) => {
  return (
    <>
      {lineups.map((l, index) => (
        <ExpandableLineup
          lineupVariation={index + 1}
          lineup={l}
          getPlayerNameById={getPlayerNameById}
        />
      ))}
    </>
  );
};
