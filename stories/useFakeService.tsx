import { useState } from 'react';
import { v4 } from 'uuid';
import { Player, PlayerId } from '../app/RegistrationList';
import { MeldelistePlayer } from '../app/components/EditableRegistrationList/EditableRegistrationList';
import { RegistrationListRepository } from '../app/repository/RegistrationListRepository';
import { RegistrationListService } from '../app/service/RegistrationListService';
import { InMemoryRepositoryWithPrefilledPlayers } from '../app/repository/RegistrationListRepositoryInMemory';

export const createFakeUseService = (playersCount: number) =>
  createUseService(InMemoryRepositoryWithPrefilledPlayers(playersCount));

const createUseService = (repo: RegistrationListRepository) => () => {
  const service = new RegistrationListService(repo);
  const toMeldeliste = (service: RegistrationListService) =>
    Object.entries(service.getList().getList()).map(([key, value]) => ({
      id: value.id,
      name: value.name,
      rank: Number(key),
    }));
  const [players, setPlayers] = useState<MeldelistePlayer[]>(
    toMeldeliste(service)
  );
  return {
    players,
    addPlayer: (rank: number, name: string) => {
      service.addPlayer(rank, { name, id: PlayerId.create(v4()) });
      setPlayers(toMeldeliste(service));
    },
    editPlayer: (player: MeldelistePlayer) => {
      if (
        service.editPlayer(player.id, {
          name: player.name,
          rank: player.rank,
        }) !== 'Rank already taken'
      ) {
        setPlayers(toMeldeliste(service));
        return 'SUCCESS';
      } else {
        return 'Rank already taken';
      }
    },
    deletePlayer: (id: PlayerId) => {
      service.removePlayer(id);
      setPlayers(toMeldeliste(service));
    },
    sortPlayer: (rankFrom: number, rankTo: number) => {
      service.sortPlayer(rankFrom, rankTo);
      setPlayers(toMeldeliste(service));
    },
    getPlayerById: (id: PlayerId): Player | undefined => {
      return service.getPlayerById(id);
    },
    selectPlayer(id: PlayerId) {
      service.selectPlayer(id);
    },
    deselectPlayer(id: PlayerId) {
      service.deselectPlayer(id);
    },
    getPlayerSelection(): Player[] {
      return service.getPlayerSelection();
    },
  };
};
function uuidv4(): string {
  throw new Error('Function not implemented.');
}
