import { Grid } from '@mui/material';

interface PlayerProps {
  rank: number;
  name: string;
}

export const PlayerCard: React.FunctionComponent<PlayerProps> = ({
  rank,
  name,
}) => {
  return (
    <>
      <Grid item container spacing={2}>
        <Grid item xs={1}>
          {rank}
        </Grid>
        <Grid item xs={11}>
          {name}
        </Grid>
      </Grid>
    </>
  );
};
