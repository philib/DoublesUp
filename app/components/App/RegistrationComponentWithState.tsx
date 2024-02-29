import React from 'react';
import {
  EditableRegistrationList,
  MeldelistePlayer,
} from '../EditableRegistrationList/EditableRegistrationList';
import { PlayerId } from '../../RegistrationList';
import { useService } from '../ServiceProvider/useRegistrationListServiceFactory';

export const RegistrationComponentWithState: React.FunctionComponent<{}> =
  () => {
    const service = useService();
    return (
      <EditableRegistrationList
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
