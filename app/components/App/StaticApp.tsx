import { Navigator } from '../Navigator/Navigator';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GroupIcon from '@mui/icons-material/Group';
import React from 'react';
import { Badge, ThemeProvider } from '@mui/material';
import { theme } from '../../theme';
import {
  Selection,
  StaticRegistrationList,
  Team,
} from '../StaticRegistrationList/StaticRegistrationList';
import {
  createLineupsFor4Players,
  createLineupsFor6Players,
} from '../../logic/createLineups';
import { Lineup } from '../../logic/Lineup';
import {
  Lineup as ComponentLineup,
  Variation,
} from '../Lineups/VariationComponent';
import { Player, PlayerId } from '../../logic/RegistrationList';
import { LineupsComponent } from '../Lineups/Lineups';
import { useFormatMessage } from '../../MyIntlProvider';

export const StaticApp: React.FunctionComponent<{
  teams: Team[];
  icon?: React.JSX.Element;
}> = ({ teams, icon }) => {
  const formatMessage = useFormatMessage();
  const [playerSelection, setPlayerSelection] =
    React.useState<Selection | null>(null);
  const amountOfSelectedPlayers = playerSelection?.players.length ?? 0;
  const currentTeam = teams.find(
    (team) =>
      playerSelection?.teamId?.id &&
      playerSelection.teamId.id.equals(team.id.id)
  );

  var lineups: Lineup<Player>[] = [];
  if (currentTeam?.size === 6) {
    lineups = createLineupsFor6Players(playerSelection?.players ?? []);
  } else if (currentTeam?.size === 4) {
    lineups = createLineupsFor4Players(playerSelection?.players ?? []);
  }
  const toLineup = (lineup: Lineup<Player>): ComponentLineup => ({
    activePlayers: lineup.activePlayers.map((player) => ({
      id: player.id,
    })),
    inactivePlayers: lineup.inactivePlayers.map((player) => ({
      id: player.id,
    })),
    variations: lineup.variations.map((doublesPairing) =>
      doublesPairing.map((pairing) =>
        pairing.map((player) => ({
          position: player.position,
          value: player.value.id,
        }))
      )
    ) as Variation[],
  });
  const getPlayerNameById = (id: PlayerId) => {
    const players = playerSelection?.players ?? [];
    const playerById = players.reduce(
      (acc, player) => ({ ...acc, [player.id.value]: player.name }),
      {} as { [id: string]: string }
    );
    return playerById[id.value] ?? '';
  };
  const RegistrationComponent = {
    disabledHint: undefined,
    title: formatMessage('registrationList.title'),
    icon: <AccountCircleIcon fontSize="large" />,
    component: (
      <StaticRegistrationList
        onSelectionChanged={(players) => {
          setPlayerSelection(players);
        }}
        teams={teams}
      />
    ),
  };

  const currentTeamSize = currentTeam?.size;
  const LineupsComponentConfig = {
    disabledHint:
      !currentTeamSize || amountOfSelectedPlayers < currentTeamSize
        ? formatMessage('lineups.notEnoughPlayers')
        : undefined,
    title: formatMessage('lineups.title'),
    icon: (
      <Badge
        sx={{ marginTop: '2px' }}
        invisible={
          !currentTeamSize ||
          amountOfSelectedPlayers == 0 ||
          amountOfSelectedPlayers >= currentTeamSize
        }
        color={'secondary'}
        badgeContent={`${amountOfSelectedPlayers}/${currentTeamSize}`}
      >
        <GroupIcon fontSize="large" />
      </Badge>
    ),
    component: (
      <LineupsComponent
        lineups={lineups.map(toLineup)}
        getPlayerNameById={getPlayerNameById}
      />
    ),
  };

  return (
    <ThemeProvider theme={theme}>
      <Navigator
        icon={icon}
        navigations={[RegistrationComponent, LineupsComponentConfig]}
      />
    </ThemeProvider>
  );
};
