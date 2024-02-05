import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';
import { MeldelistePlayer } from '../Meldeliste/Meldeliste';
import { Player, PlayerId } from '../RegistrationList';
import { RegistrationListService } from './RegistrationListService';
import { RegistrationListRepository } from '../repository/RegistrationListRepository';

export const createUseService = (repo: RegistrationListRepository) => () => {
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
      service.addPlayer(rank, { name, id: PlayerId.create(uuidv4()) });
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
  };
};
