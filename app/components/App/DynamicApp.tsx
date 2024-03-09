import { Navigator } from '../Navigator/Navigator';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GroupIcon from '@mui/icons-material/Group';
import React from 'react';
import { useService } from '../ServiceProvider/useRegistrationListServiceFactory';
import { Badge, ThemeProvider } from '@mui/material';
import { theme } from '../../theme';
import { LineupsComponentWithState } from './LineupsComponentWithState';
import { RegistrationComponentWithState } from './RegistrationComponentWithState';
import { useFormatMessage } from '../../MyIntlProvider';

export const DynamicApp: React.FunctionComponent<{}> = ({}) => {
  const formatMessage = useFormatMessage();
  const amountOfSelectedPlayers = useService().playerSelection.length;
  const RegistrationComponent = {
    disabledHint: undefined,
    title: formatMessage('registrationList.title'),
    icon: <AccountCircleIcon fontSize="large" />,
    component: <RegistrationComponentWithState />,
  };

  const LineupsComponentConfig = {
    disabledHint:
      amountOfSelectedPlayers < 6
        ? formatMessage('lineups.notEnoughPlayers')
        : undefined,
    title: formatMessage('lineups.title'),
    icon: (
      <Badge
        sx={{ marginTop: '2px' }}
        invisible={amountOfSelectedPlayers >= 6}
        color={'secondary'}
        badgeContent={`${amountOfSelectedPlayers}/6`}
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
