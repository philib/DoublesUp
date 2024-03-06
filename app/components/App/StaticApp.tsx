import { Navigator } from '../Navigator/Navigator';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GroupIcon from '@mui/icons-material/Group';
import React, { useEffect } from 'react';
import { Badge, ThemeProvider } from '@mui/material';
import { theme } from '../../theme';
import {
  Selection,
  StaticRegistrationList,
  Team,
} from '../StaticRegistrationList/StaticRegistrationList';
import { Lineup, createLineups } from '../../LineupFactory';
import {
  Lineup as ComponentLineup,
  Variation,
} from '../Lineups/VariationComponent';
import { Player, PlayerId } from '../../RegistrationList';
import { LineupsComponent } from '../Lineups/Lineups';
import { useFormatMessage } from '../../MyIntlProvider';
import { readTeams } from '../../teams/readTeams';

export const StaticApp: React.FunctionComponent<{ teams: Team[] }> = ({
  teams,
}) => {
  const formatMessage = useFormatMessage();
  const [playerSelection, setPlayerSelection] =
    React.useState<Selection | null>(null);
  const playerSelectionLengthByStatic = playerSelection?.players.length ?? 0;
  const lineups = createLineups(playerSelection?.players ?? []);
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

  const LineupsComponentConfig = {
    disabledHint:
      playerSelectionLengthByStatic < 6
        ? formatMessage('lineups.atLeast6PlayersNeeded')
        : undefined,
    title: formatMessage('lineups.title'),
    icon: (
      <Badge
        sx={{ marginTop: '2px' }}
        invisible={playerSelectionLengthByStatic >= 6}
        color={'secondary'}
        badgeContent={`${playerSelectionLengthByStatic}/6`}
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
        navigations={[RegistrationComponent, LineupsComponentConfig]}
      />
    </ThemeProvider>
  );
};
