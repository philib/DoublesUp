import { PlayerCard } from './PlayerCard';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  TextField,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { EditDialog } from './EditDialog';
import { PlayerId } from '../../RegistrationList';
import { SortableList } from './SortableList';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import AddIcon from '@mui/icons-material/Add';
import { theme } from '../../theme';
import { headerAndBottomNavigationHeight } from '../Navigator/Navigator';
export interface MeldelistePlayer {
  id: PlayerId;
  rank: number;
  name: string;
}

interface EditableRegistrationListProps {
  players: MeldelistePlayer[];
  addPlayer: (player: { name: string; rank: number }) => void;
  editPlayer: (player: MeldelistePlayer) => 'Rank already taken' | 'SUCCESS';
  sortPlayer: (rankFrom: number, rankTo: number) => void;
  deletePlayer: (id: PlayerId) => void;
  onPlayerListModified: (players: MeldelistePlayer[]) => void;
  selectPlayer: (id: PlayerId) => void;
  deselectPlayer: (id: PlayerId) => void;
  isPlayerSelected: (id: PlayerId) => boolean;
}

type EditDialogState =
  | { open: false }
  | {
      open: true;
      player: { id: PlayerId; rank: number; name: string };
    };

const SortableListElement: React.FunctionComponent<{
  player: { name: string; rank: number };
  isPlayerSelected: boolean;
  onPlayerCardClicked: () => void;
  onSelectClicked: (active: boolean) => void;
}> = ({ player, isPlayerSelected, onPlayerCardClicked, onSelectClicked }) => {
  return (
    <div style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
      <div style={{ width: '100%', flexGrow: 2 }} onClick={onPlayerCardClicked}>
        <PlayerCard rank={player.rank} name={player.name} />
      </div>
      <SportsTennisIcon
        onClick={() => {
          onSelectClicked(!isPlayerSelected);
        }}
        style={{
          flexGrow: 1,
          color: isPlayerSelected
            ? theme.palette.primary.main
            : theme.palette.secondary.main,
        }}
      />
    </div>
  );
};

export const EditableRegistrationList: React.FunctionComponent<
  EditableRegistrationListProps
> = ({
  players,
  addPlayer,
  editPlayer,
  sortPlayer,
  deletePlayer,
  onPlayerListModified,
  selectPlayer,
  deselectPlayer,
  isPlayerSelected,
}) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState<EditDialogState>({
    open: false,
  });
  const newPlayerNameRef = useRef<HTMLInputElement>(null);
  const newPlayerRankRef = useRef<HTMLInputElement>(null);
  const editDialog = (
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
  );

  const addDialog = (
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
  );

  useEffect(() => {
    onPlayerListModified(players.sort((a, b) => a.rank - b.rank));
  }, [players, onPlayerListModified]);
  return (
    <div
      id="#meldeliste"
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {editDialog}
      {addDialog}
      <div style={{ flex: 1, width: '100%', overflow: 'auto' }}>
        <SortableList
          cards={players.map((player) => ({
            id: player.id.value,
            component: (
              <SortableListElement
                player={player}
                isPlayerSelected={isPlayerSelected(player.id)}
                onSelectClicked={(active) => {
                  if (active) {
                    selectPlayer(player.id);
                  } else {
                    deselectPlayer(player.id);
                  }
                }}
                onPlayerCardClicked={() =>
                  setEditDialogOpen({ open: true, player })
                }
              />
            ),
          }))}
          moveCards={(dragIndex, hoverIndex) => {
            sortPlayer(dragIndex + 1, hoverIndex + 1);
          }}
        />
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
        <AddIcon />
      </Fab>
    </div>
  );
};
