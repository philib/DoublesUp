import { Navigation, Navigator, NavigatorProps } from './Navigator/Navigator';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import React, { useEffect } from 'react';
import { Meldeliste, MeldelistePlayer } from './Meldeliste/Meldeliste';
import { PlayerId } from './RegistrationList';
import { LineupsComponent } from './Lineups/Lineups';
import { useService } from './service/useRegistrationListServiceFactory';

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
const LineupsComponentWithState: React.FunctionComponent<{}> = () => {
  const service = useService();
  return (
    <LineupsComponent
      lineups={service.lineups.map((l) => ({
        activePlayers: l.activePlayers.map((a) => ({ name: a })),
        inactivePlayers: l.inactivePlayers.map((a) => ({ name: a })),
        variations: l.variations,
      }))}
    />
  );
};

export const App: React.FunctionComponent<{}> = () => {
  const service = useService();
  const RegistrationComponent = {
    title: 'Registration List',
    icon: AccountCircleIcon,
    component: <RegistrationComponentWithState />,
  };
  const LineupsComponent = {
    title: 'Lineups',
    icon: AccountCircleIcon,
    component: <LineupsComponentWithState />,
  };

  const [navigations, setNavigations] = React.useState([RegistrationComponent]);
  useEffect(() => {
    if (service.playerSelection.length >= 6) {
      setNavigations([RegistrationComponent, LineupsComponent]);
    } else {
      setNavigations([RegistrationComponent]);
    }
  }, [service.playerSelection]);

  return <Navigator navigations={navigations} />;
};
