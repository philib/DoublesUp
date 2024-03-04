import { Navigator } from '../Navigator/Navigator';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GroupIcon from '@mui/icons-material/Group';
import React from 'react';
import { useService } from '../ServiceProvider/useRegistrationListServiceFactory';
import { Badge, ThemeProvider } from '@mui/material';
import { theme } from '../../theme';
import { LineupsComponentWithState } from './LineupsComponentWithState';
import { RegistrationComponentWithState } from './RegistrationComponentWithState';
import {
  Selection,
  StaticRegistrationList,
} from '../StaticRegistrationList/StaticRegistrationList';
import { teamConfig } from '../../../team.config';
import { Lineup, createLineups } from '../../LineupFactory';
import {
  Lineup as ComponentLineup,
  Variation,
} from '../Lineups/VariationComponent';
import { Player, PlayerId } from '../../RegistrationList';
import { LineupsComponent } from '../Lineups/Lineups';

export const App: React.FunctionComponent<{ staticList?: boolean }> = ({
  staticList = false,
}) => {
  const [playerSelection, setPlayerSelection] =
    React.useState<Selection | null>(null);
  const playerSelectionLengthByService = useService().playerSelection.length;
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
    title: 'Registration List',
    icon: <AccountCircleIcon fontSize="large" />,
    component: staticList ? (
      <StaticRegistrationList
        onSelectionChanged={(players) => {
          setPlayerSelection(players);
        }}
        teams={teamConfig.teams}
      />
    ) : (
      <RegistrationComponentWithState />
    ),
  };

  const LineupsComponentConfig = {
    disabledHint: (
      staticList
        ? playerSelectionLengthByStatic < 6
        : playerSelectionLengthByService < 6
    )
      ? 'At least 6 players must be selected'
      : undefined,
    title: 'Lineups',
    icon: (
      <Badge
        sx={{ marginTop: '2px' }}
        invisible={
          staticList
            ? playerSelectionLengthByStatic >= 6
            : playerSelectionLengthByService >= 6
        }
        color={'secondary'}
        badgeContent={`${
          staticList
            ? playerSelectionLengthByStatic
            : playerSelectionLengthByService
        }/6`}
      >
        <GroupIcon fontSize="large" />
      </Badge>
    ),
    component: staticList ? (
      <LineupsComponent
        lineups={lineups.map(toLineup)}
        getPlayerNameById={getPlayerNameById}
      />
    ) : (
      <LineupsComponentWithState />
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
