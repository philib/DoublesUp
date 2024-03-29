import {
    Checkbox,
    Collapse,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import {PlayerId} from '../../logic/RegistrationList';
import {Id} from '../model/Id';

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {useState} from 'react';
import {sortBy} from 'lodash';
import {MyList, MyListItem, MyListSubHeader} from "../List/ListComponent";
import styles from '../../app.module.css';

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
> = ({teams, onSelectionChanged}) => {
    const [selection, setSelection] = useState<Selection | null>(null);
    const [openedTeam, setOpenedTeam] = useState<TeamId | null>(
        selection?.teamId ?? null
    );

    const handleToggle = (teamId: TeamId, player: Player) => () => {
        if (teamId !== selection?.teamId) {
            setSelection({teamId, players: [player]});
            onSelectionChanged({teamId, players: [player]});
            return;
        }
        var newChecked = [...(selection?.players ?? [])];

        const existing = newChecked.find((p) => p.id === player.id);
        if (existing) {
            newChecked = newChecked.filter((it) => it.id !== player.id);
        } else {
            newChecked.push(player);
        }

        const rankByPlayer = Object.entries(
            teams.find((t) => t.id === teamId)?.registrationList!
        ).reduce(
            (acc, [rank, p]) => ({...acc, [p.id.value]: Number(rank)}),
            {} as { [id: string]: number }
        );

        const sorted = sortBy(
            newChecked.map((p) => ({rank: rankByPlayer[p.id.value], player: p})),
            (it) => it.rank
        ).map((it) => it.player);

        setSelection({teamId, players: sorted});
        onSelectionChanged({teamId, players: sorted});
    };
    return (
        <MyList
            className={`${styles.fadingOverflow}`}
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
                    <MyListSubHeader>
                        <div
                            style={{marginBottom: openedTeam === team.id ? undefined : '10px'}}>
                            <ListItemButton
                                onClick={() => {
                                    setOpenedTeam(openedTeam === team.id ? null : team.id);
                                }}
                            >
                                <ListItemText primary={team.name}/>
                                {openedTeam === team.id ? <ExpandLess/> : <ExpandMore/>}
                            </ListItemButton>
                        </div>
                    </MyListSubHeader>
                    <Collapse in={openedTeam === team.id} timeout="auto" unmountOnExit>
                        <MyList>
                            {/* <ListSubheader>{team.name}</ListSubheader> */}
                            {Object.values(team.registrationList).map((it) => {
                                const labelId = `checkbox-list-label-${it.name}`;

                                return (
                                    <MyListItem key={it.name}>
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
                                                    inputProps={{'aria-labelledby': labelId}}
                                                />
                                            </ListItemIcon>
                                            <ListItemText id={labelId} primary={it.name}/>
                                        </ListItemButton>
                                    </MyListItem>
                                );
                            })}
                        </MyList>
                    </Collapse>
                </>
            ))}
        </MyList>
    );
};
