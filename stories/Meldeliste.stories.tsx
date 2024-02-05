import { Meta } from '@storybook/react';
import { Meldeliste, MeldelistePlayer } from '../app/Meldeliste/Meldeliste';
import { PlayerCard } from '../app/Meldeliste/PlayerCard';
import { PlayerId, RegistrationList } from '../app/RegistrationList';
import { RegistrationListRepository } from '../app/repository/RegistrationListRepository';
import { createUseService } from '../app/service/useRegistrationListServiceFactory';
import { createFakeUseService } from './useFakeService';

const meta = {
  title: 'Meldeliste',
  component: Meldeliste,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Meldeliste>;

export default meta;

class Repo implements RegistrationListRepository {
  list: RegistrationList;
  constructor(list: RegistrationList) {
    this.list = list;
  }

  save(registrationList: RegistrationList): void {
    this.list = registrationList;
  }
  get(): RegistrationList {
    return this.list;
  }
}

const useService = createFakeUseService(10);

export const Liste = () => {
  const service = useService();

  return (
    <div style={{ height: '500px', width: '400px', backgroundColor: 'yellow' }}>
      <Meldeliste
        players={service.players}
        addPlayer={(p) => {
          service.addPlayer(p.rank, p.name);
        }}
        deletePlayer={(p) => {
          service.deletePlayer(p);
        }}
        editPlayer={(p) => {
          return service.editPlayer(p);
        }}
        sortPlayer={(rankFrom, rankTo) => {
          return service.sortPlayer(rankFrom, rankTo);
        }}
        onPlayerListModified={function (players: MeldelistePlayer[]): void {
          console.log(JSON.stringify(players));
        }}
      />
    </div>
  );
};

export const Spieler = () => {
  return <PlayerCard rank={1} name="Max Mustermann" />;
};
