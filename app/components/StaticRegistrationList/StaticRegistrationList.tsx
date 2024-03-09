import {
  Checkbox,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { PlayerId } from '../../logic/RegistrationList';
import { Id } from '../model/Id';

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useState } from 'react';
export type TeamId = { type: 'Team'; id: Id };

export interface Player {
  id: PlayerId;
  name: string;
}

export interface Team {
  id: TeamId;
  size: 4 | 6;
  name: string;
  registrationList: {
    [rank: number]: Player;
  };
}

export interface Selection {
  teamId: TeamId;
  players: Player[];
}
export interface StaticRegistrationListProps {
  teams: Team[];
  onSelectionChanged: (selection: Selection | null) => void;
}

export const StaticRegistrationList: React.FunctionComponent<
  StaticRegistrationListProps
> = ({ teams, onSelectionChanged }) => {
  const [selection, setSelection] = useState<Selection | null>(null);
  const [openedTeam, setOpenedTeam] = useState<TeamId | null>(
    selection?.teamId ?? null
  );

  const handleToggle = (teamId: TeamId, player: Player) => () => {
    if (teamId !== selection?.teamId) {
      setSelection({ teamId, players: [player] });
      onSelectionChanged({ teamId, players: [player] });
      return;
    }
    var newChecked = [...(selection?.players ?? [])];

    const existing = newChecked.find((p) => p.id === player.id);
    if (existing) {
      newChecked = newChecked.filter((it) => it.id !== player.id);
    } else {
      newChecked.push(player);
    }

    setSelection({ teamId, players: newChecked });
    onSelectionChanged({ teamId, players: newChecked });
  };
  return (
    <List
      sx={{
        paddingTop: 0,
        width: '100%',
        height: '100%',
        bgcolor: 'background.paper',
        overflow: 'auto',
      }}
    >
      {teams.map((team) => (
        <>
          <ListItemButton
            onClick={() => {
              setOpenedTeam(openedTeam === team.id ? null : team.id);
            }}
          >
            <ListItemText primary={team.name} />
            {openedTeam === team.id ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openedTeam === team.id} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {/* <ListSubheader>{team.name}</ListSubheader> */}
              {Object.values(team.registrationList).map((it) => {
                const labelId = `checkbox-list-label-${it.name}`;

                return (
                  <ListItem key={it.name} disablePadding>
                    <ListItemButton
                      role={undefined}
                      onClick={handleToggle(team.id, it)}
                      dense
                    >
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={
                            selection !== null &&
                            selection.players.find((p) => p.id === it.id) !==
                              undefined
                          }
                          tabIndex={-1}
                          disableRipple
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </ListItemIcon>
                      <ListItemText id={labelId} primary={it.name} />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Collapse>
        </>
      ))}
    </List>
  );
};
