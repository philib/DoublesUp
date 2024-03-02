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

export const App: React.FunctionComponent<{ staticList?: boolean }> = ({
  staticList = false,
}) => {
  const [playerSelection, setPlayerSelection] =
    React.useState<Selection | null>(null);
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
        ? playerSelection?.players && playerSelection.players.length < 6
        : useService().playerSelection.length < 6
    )
      ? 'At least 6 players must be selected'
      : undefined,
    title: 'Lineups',
    icon: (
      <Badge
        sx={{ marginTop: '2px' }}
        invisible={
          staticList
            ? playerSelection?.players && playerSelection.players.length >= 6
            : useService().playerSelection.length >= 6
        }
        color={'secondary'}
        badgeContent={`${
          staticList
            ? playerSelection?.players && playerSelection.players.length
            : useService().playerSelection.length
        }/6`}
      >
        <GroupIcon fontSize="large" />
      </Badge>
    ),
    component: <LineupsComponentWithState />,
  };

  return (
    <ThemeProvider theme={theme}>
      <Navigator
        navigations={[RegistrationComponent, LineupsComponentConfig]}
      />
    </ThemeProvider>
  );
};
