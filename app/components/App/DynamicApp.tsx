import { Navigator } from '../Navigator/Navigator';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GroupIcon from '@mui/icons-material/Group';
import React from 'react';
import { useService } from '../ServiceProvider/useRegistrationListServiceFactory';
import { Badge, ThemeProvider } from '@mui/material';
import { theme } from '../../theme';
import { LineupsComponentWithState } from './LineupsComponentWithState';
import { RegistrationComponentWithState } from './RegistrationComponentWithState';
import { Selection } from '../StaticRegistrationList/StaticRegistrationList';
import { useFormatMessage } from '../../MyIntlProvider';

export const DynamicApp: React.FunctionComponent<{}> = ({}) => {
  const formatMessage = useFormatMessage();
  const [playerSelection, setPlayerSelection] =
    React.useState<Selection | null>(null);
  const playerSelectionLengthByService = useService().playerSelection.length;
  const RegistrationComponent = {
    disabledHint: undefined,
    title: formatMessage('registrationList.title'),
    icon: <AccountCircleIcon fontSize="large" />,
    component: <RegistrationComponentWithState />,
  };

  const LineupsComponentConfig = {
    disabledHint:
      playerSelectionLengthByService < 6
        ? formatMessage('lineups.atLeast6PlayersNeeded')
        : undefined,
    title: formatMessage('lineups.title'),
    icon: (
      <Badge
        sx={{ marginTop: '2px' }}
        invisible={playerSelectionLengthByService >= 6}
        color={'secondary'}
        badgeContent={`${playerSelectionLengthByService}/6`}
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
