import { v4 as uuidv4 } from 'uuid';
import { createContext, useContext, useEffect, useState } from 'react';
import { MeldelistePlayer } from '../components/Meldeliste/Meldeliste';
import { Player, PlayerId } from '../RegistrationList';
import { RegistrationListService } from './RegistrationListService';
import { RegistrationListRepository } from '../repository/RegistrationListRepository';
import { Lineup } from '../LineupFactory';

interface ServiceContextType {
  players: MeldelistePlayer[];
  lineups: Lineup[];
  playerSelection: Player[];
  addPlayer: (rank: number, name: string) => void;
  editPlayer: (player: MeldelistePlayer) => 'SUCCESS' | 'Rank already taken';
  deletePlayer: (id: PlayerId) => void;
  sortPlayer: (rankFrom: number, rankTo: number) => void;
  getPlayerById: (id: PlayerId) => Player | undefined;
  selectPlayer: (id: PlayerId) => void;
  deselectPlayer: (id: PlayerId) => void;
  isPlayerSelected: (id: PlayerId) => boolean;
}

export const ServiceContext = createContext<ServiceContextType | null>(null);

const toMeldeliste = (service: RegistrationListService) =>
  Object.entries(service.getList().getList()).map(([key, value]) => ({
    id: value.id,
    name: value.name,
    rank: Number(key),
  }));

export const ServiceProvider: React.FunctionComponent<{
  children: React.ReactNode;
  repo: RegistrationListRepository;
}> = ({ children, repo }) => {
  const [service] = useState(new RegistrationListService(repo));
  const [players, setPlayers] = useState<MeldelistePlayer[]>(
    toMeldeliste(service)
  );
  const [playerSelection, setPlayerSelection] = useState<Player[]>([]);
  const [lineups, setLineups] = useState<Lineup[]>([]);
  useEffect(() => {
    setLineups(service.getLineups());
  }, [playerSelection, players, service]);

  const value = {
    players,
    playerSelection,
    lineups,
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
      setPlayerSelection(service.getPlayerSelection());
    },
    sortPlayer: (rankFrom: number, rankTo: number) => {
      service.sortPlayer(rankFrom, rankTo);
      setPlayers(toMeldeliste(service));
      setPlayerSelection(service.getPlayerSelection());
    },
    getPlayerById: (id: PlayerId): Player | undefined => {
      return service.getPlayerById(id);
    },
    selectPlayer(id: PlayerId) {
      service.selectPlayer(id);
      setPlayerSelection(service.getPlayerSelection());
    },
    deselectPlayer(id: PlayerId) {
      service.deselectPlayer(id);
      setPlayerSelection(service.getPlayerSelection());
    },
    isPlayerSelected(id: PlayerId) {
      return service.isPlayerSelected(id);
    },
  };
  return (
    <ServiceContext.Provider value={value}>{children}</ServiceContext.Provider>
  );
};

export const useService = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useService must be used within a ServiceProvider');
  }
  return context;
};

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
