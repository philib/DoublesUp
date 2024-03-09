import { Meta } from '@storybook/react';
import {
  EditableRegistrationList,
  MeldelistePlayer,
} from '../app/components/EditableRegistrationList/EditableRegistrationList';
import { PlayerCard } from '../app/components/EditableRegistrationList/PlayerCard';
import { PlayerId, RegistrationList } from '../app/logic/RegistrationList';
import { RegistrationListRepository } from '../app/repository/RegistrationListRepository';
import { createFakeUseService } from './useFakeService';
import React from 'react';

const meta = {
  title: 'Editable Registration List',
  component: EditableRegistrationList,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<typeof EditableRegistrationList>;

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

export const Default = () => {
  const service = useService();
  const [playerSelection, setPlayerSelection] = React.useState<{
    [id: string]: boolean;
  }>({});

  return (
    <div style={{ height: '100vh', width: '400px', backgroundColor: 'yellow' }}>
      <EditableRegistrationList
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
        onPlayerListModified={function (players: MeldelistePlayer[]): void {}}
        selectPlayer={(id: PlayerId) => {
          setPlayerSelection({ ...playerSelection, [id.value]: true });
        }}
        deselectPlayer={(id: PlayerId) => {
          setPlayerSelection({ ...playerSelection, [id.value]: false });
        }}
        isPlayerSelected={(id: PlayerId) => {
          return playerSelection[id.value] ?? false;
        }}
      />
    </div>
  );
};

export const Spieler = () => {
  return <PlayerCard rank={1} name="Max Mustermann" />;
};
