import { Navigator } from './Navigator/Navigator';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GroupIcon from '@mui/icons-material/Group';
import React, { useEffect } from 'react';
import { Meldeliste, MeldelistePlayer } from './Meldeliste/Meldeliste';
import { PlayerId } from './RegistrationList';
import { LineupsComponent } from './Lineups/Lineups';
import { useService } from './service/useRegistrationListServiceFactory';
import { Badge, ThemeProvider } from '@mui/material';
import { theme } from './theme';

const RegistrationComponentWithState: React.FunctionComponent<{}> = () => {
  const service = useService();
  return (
    <Meldeliste
      players={service.players}
      addPlayer={(p) => {
        service.addPlayer(p.rank, p.name);
      }}
      deletePlayer={(p) => {
        service.deletePlayer(p);
      }}
      editPlayer={(p) => {
        const e = service.editPlayer(p);
        return e;
      }}
      sortPlayer={(rankFrom, rankTo) => {
        const sort = service.sortPlayer(rankFrom, rankTo);
        return sort;
      }}
      onPlayerListModified={function (players: MeldelistePlayer[]): void {}}
      selectPlayer={(id: PlayerId) => {
        service.selectPlayer(id);
      }}
      deselectPlayer={(id: PlayerId) => {
        service.deselectPlayer(id);
      }}
      isPlayerSelected={(id: PlayerId) => {
        return service.isPlayerSelected(id);
      }}
    />
  );
};
export const LineupsComponentWithState: React.FunctionComponent<{}> = () => {
  const service = useService();
  const [lineups, setLineups] = React.useState(service.lineups);
  useEffect(() => {
    setLineups(service.lineups);
  }, [service.lineups]);
  return (
    <LineupsComponent
      lineups={lineups.map((lineup) => ({
        activePlayers: lineup.activePlayers.map((player) => ({
          id: player,
          name: service.getPlayerById(player)?.name ?? '',
        })),
        inactivePlayers: lineup.inactivePlayers.map((player) => ({
          id: player,
          name: service.getPlayerById(player)?.name ?? '',
        })),
        variations: lineup.variations.map((doublePairings) => {
          return doublePairings.map(([firstPlayer, secondPlayer]) => {
            return [
              {
                ...firstPlayer,
                name: service.getPlayerById(firstPlayer.id)?.name ?? '',
              },
              {
                ...secondPlayer,
                name: service.getPlayerById(secondPlayer.id)?.name ?? '',
              },
            ];
          });
        }),
      }))}
      getPlayerNameById={(id) => {
        return service.getPlayerById(id)?.name ?? '';
      }}
    />
  );
};

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
