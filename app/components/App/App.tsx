import { Navigator } from '../Navigator/Navigator';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GroupIcon from '@mui/icons-material/Group';
import React from 'react';
import { useService } from '../../service/useRegistrationListServiceFactory';
import { Badge, ThemeProvider } from '@mui/material';
import { theme } from '../../theme';
import { LineupsComponentWithState } from './LineupsComponentWithState';
import { RegistrationComponentWithState } from './RegistrationComponentWithState';

export const App: React.FunctionComponent<{}> = () => {
  const RegistrationComponent = {
    disabledHint: undefined,
    title: 'Registration List',
    icon: <AccountCircleIcon fontSize="large" />,
    component: <RegistrationComponentWithState />,
  };
  const LineupsComponent = {
    disabledHint:
      useService().playerSelection.length < 6
        ? 'At least 6 players must be selected'
        : undefined,
    title: 'Lineups',
    icon: (
      <Badge
        sx={{ marginTop: '2px' }}
        invisible={useService().playerSelection.length >= 6}
        color={'secondary'}
        badgeContent={`${useService().playerSelection.length}/6`}
      >
        <GroupIcon fontSize="large" />
      </Badge>
    ),
    component: <LineupsComponentWithState />,
  };

  return (
    <ThemeProvider theme={theme}>
      <Navigator navigations={[RegistrationComponent, LineupsComponent]} />
    </ThemeProvider>
  );
};
