import { PlayerCard } from './PlayerCard';
import AddIcon from '@mui/icons-material/Add';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Fab,
  Grid,
  List,
  ListItem,
  TextField,
} from '@mui/material';
import React, { useEffect, useRef } from 'react';
import { EditDialog } from './EditDialog';
import { PlayerId } from '../RegistrationList';

export interface MeldelistePlayer {
  id: PlayerId;
  rank: number;
  name: string;
}

interface MeldelisteProps {
  players: MeldelistePlayer[];
  addPlayer: (player: { name: string; rank: number }) => void;
  editPlayer: (player: MeldelistePlayer) => 'Rank already taken' | 'SUCCESS';
  deletePlayer: (id: PlayerId) => void;
  onPlayerListModified: (players: MeldelistePlayer[]) => void;
}

type EditDialogState =
  | { open: false }
  | {
      open: true;
      player: { id: PlayerId; rank: number; name: string };
    };

export const Meldeliste: React.FunctionComponent<MeldelisteProps> = ({
  players,
  addPlayer,
  editPlayer,
  deletePlayer,
  onPlayerListModified,
}) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState<EditDialogState>({
    open: false,
  });
  const newPlayerNameRef = useRef<HTMLInputElement>(null);
  const newPlayerRankRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    onPlayerListModified(players.sort((a, b) => a.rank - b.rank));
  }, [players]);
  return (
    <Grid container spacing={2}>
      <Grid item container xs={12} justifyContent={'center'}>
        <Grid item>Meldeliste</Grid>
      </Grid>
      <Grid item container xs={12}>
        <List sx={{ width: '100%' }}>
          <EditDialog
            open={editDialogOpen.open}
            info={
              editDialogOpen.open
                ? {
                    name: editDialogOpen.player.name,
                    rank: editDialogOpen.player.rank,
                    onChange: (newPlayer: { name: string; rank: number }) => {
                      if (
                        editPlayer({
                          id: editDialogOpen.player.id,
                          ...newPlayer,
                        }) === 'Rank already taken'
                      ) {
                        return 'Rank already taken';
                      }

                      setEditDialogOpen({ open: false });
                      return null;
                    },
                    onAbort: () => setEditDialogOpen({ open: false }),
                    onDelete: () => {
                      deletePlayer(editDialogOpen.player.id);
                      setEditDialogOpen({ open: false });
                    },
                  }
                : undefined
            }
          />
          {players
            .sort((a, b) => a.rank - b.rank)
            .map((player) => (
              <>
                <ListItem
                  onClick={() =>
                    setEditDialogOpen({
                      open: true,
                      player,
                    })
                  }
                >
                  <PlayerCard rank={player.rank} name={player.name} />
                </ListItem>
                <Divider variant="middle" component="li" />
              </>
            ))}
        </List>
      </Grid>
      <Grid item container justifyContent="flex-end" alignItems="flex-end">
        <React.Fragment>
          <Fab
            color="primary"
            aria-label="add"
            onClick={() => {
              setDialogOpen(dialogOpen ? false : true);
            }}
          >
            <AddIcon />
          </Fab>
          <Dialog open={dialogOpen}>
            <DialogTitle>Spieler hinzufügen</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                required
                margin="dense"
                id="name"
                name="name"
                label="Rang"
                type="number"
                fullWidth
                variant="standard"
                inputRef={newPlayerRankRef}
              />
              <TextField
                required
                margin="dense"
                id="name"
                name="name"
                label="Spielername"
                type="text"
                fullWidth
                variant="standard"
                inputRef={newPlayerNameRef}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Fertig</Button>
              <Button
                onClick={() => {
                  if (
                    newPlayerNameRef?.current == null ||
                    newPlayerRankRef?.current == null
                  )
                    return;
                  if (newPlayerNameRef.current.value.trim() === '') return;
                  const rank = Number(newPlayerRankRef.current.value);
                  if (rank == 0) return;

                  addPlayer({
                    rank,
                    name: newPlayerNameRef.current.value,
                  });
                  newPlayerNameRef.current.value = '';
                  newPlayerRankRef.current.value = '';
                }}
              >
                Hinzufügen
              </Button>
            </DialogActions>
          </Dialog>
        </React.Fragment>
      </Grid>
    </Grid>
  );
};
