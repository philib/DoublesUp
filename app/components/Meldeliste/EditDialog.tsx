import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { MeldelistePlayer } from './Meldeliste';

interface EditDialogProps {
  open: boolean;
  info:
    | {
        rank: number;
        name: string;
        onChange: (player: { rank: number; name: string }) => string | null;
        onAbort: () => void;
        onDelete: () => void;
      }
    | undefined;
}

export const EditDialog: React.FunctionComponent<EditDialogProps> = (props) => {
  const [name, setName] = useState(props.info?.name);
  const [rank, setRank] = useState(props.info?.rank);
  const [rankError, setRankError] = useState<null | string>(null);
  useEffect(() => {
    setName(props.info?.name);
  }, [props.info?.name]);
  useEffect(() => {
    setRank(props.info?.rank);
  }, [props.info?.rank]);
  return (
    <Dialog open={props.open}>
      <DialogTitle>Spieler bearbeiten</DialogTitle>
      <DialogContent>
        <TextField
          error={rankError !== null}
          helperText={rankError}
          required
          margin="dense"
          id="name"
          name="name"
          label="Rang"
          type="number"
          fullWidth
          variant="standard"
          value={rank}
          onChange={(e) => setRank(Number(e.target.value))}
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
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setRankError(null);
            props.info?.onAbort();
          }}
        >
          Abbrechen
        </Button>
        <Button
          onClick={() => {
            if (name?.trim() === '') return;
            if (rank == 0) return;

            const result =
              props.info && rank && name
                ? props.info.onChange({ rank, name })
                : null;
            setRankError(result);
          }}
        >
          Ändern
        </Button>
        <Button onClick={() => props.info?.onDelete()}>Löschen</Button>
      </DialogActions>
    </Dialog>
  );
};
