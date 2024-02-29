import { Grid, IconButton } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { PlayerId } from '../../RegistrationList';

export type Variation = [
  { position: number; id: PlayerId },
  { position: number; id: PlayerId }
][];

export interface Lineup {
  activePlayers: { id: PlayerId }[];
  inactivePlayers: { id: PlayerId }[];
  variations: Variation[];
}

export const VariationComponent: React.FC<{
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
