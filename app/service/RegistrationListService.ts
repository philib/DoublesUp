import { sortBy, uniqBy } from 'lodash';
import { Player, PlayerId, RegistrationList } from '../RegistrationList';
import { RegistrationListRepository } from '../repository/RegistrationListRepository';
import { Lineup, createLineups } from '../LineupFactory';

export type PairingFilter = {
  player1: {
    position: number;
    id: PlayerId;
  };
  player2: {
    position: number;
    id: PlayerId;
  };
};
export type InactivePairingFilter = {
  _type: 'Inactive';
  filter: PairingFilter;
};
export type ActivePairingFilter = {
  _type: 'Active';
  filter: PairingFilter;
};
export type UnavailablePairingFilter = {
  _type: 'Unavailable';
  filter: PairingFilter;
};

export class RegistrationListService {
  private repository: RegistrationListRepository;
  private selectedPlayer: PlayerId[];
  constructor(repository: RegistrationListRepository) {
    this.repository = repository;
    this.selectedPlayer = [];
  }
  getList(): RegistrationList {
    return this.repository.get();
  }
  addPlayer(rank: number, player: Player) {
    const registrationList = this.repository.get();
    const result = registrationList.addPlayer(rank, player);
    if (result instanceof RegistrationList) {
      this.repository.save(result);
    }
    return result;
  }
  removePlayer(id: PlayerId) {
    this.deselectPlayer(id);
    const registrationList = this.repository.get();
    const result = registrationList.removePlayer(id);
    this.repository.save(result);
    return result;
  }
  editPlayer(
    id: PlayerId,
    details: { name: string; rank: number }
  ): RegistrationList | 'Rank already taken' {
    const registrationList = this.repository.get();
    const result = registrationList.editPlayer(id, details);
    if (result !== 'Rank already taken') {
      this.repository.save(result);
      return result;
    } else {
      return 'Rank already taken';
    }
  }
  sortPlayer(rankFrom: number, rankTo: number) {
    const registrationList = this.repository.get();
    const result = registrationList.sortPlayer(rankFrom, rankTo);
    this.repository.save(result);
    return result;
  }
  getPlayerById(id: PlayerId) {
    const registrationList = this.repository.get();
    return registrationList.getPlayerById(id);
  }
  selectPlayer(id: PlayerId) {
    this.selectedPlayer = [...this.selectedPlayer, id];
  }
  deselectPlayer(id: PlayerId) {
    this.selectedPlayer = this.selectedPlayer.filter(
      (it) => it.value !== id.value
    );
  }
  isPlayerSelected(id: PlayerId) {
    return this.selectedPlayer.some((it) => it.value === id.value);
  }
  getPlayerSelection(): Player[] {
    const registrationList = this.repository.get();
    const selectedPlayer = this.selectedPlayer.map(
      (id) => registrationList.getPlayerById(id)!!
    );
    return sortBy(selectedPlayer, (p) => registrationList.getRankById(p.id));
  }
  getLineups(filters: PlayerId[] = []): Lineup[] {
    const registrationList = this.repository.get();
    const selectedPlayer = this.selectedPlayer.reduce(
      (acc, id) => ({
        ...acc,
        [registrationList.getRankById(id)!!]: id,
      }),
      {} as { [rank: number]: PlayerId }
    );
    const lineups = createLineups(selectedPlayer);
    const result = lineups === 'Not enough players' ? [] : lineups;
    return filters.reduce((acc, filter) => {
      return acc.filter((lineup) => {
        return lineup.activePlayers.find((player) => player.equals(filter));
      });
    }, result);
  }
  getAvailableFilters(
    appliedFilters: { player1: PlayerId; player2: PlayerId }[]
  ): (InactivePairingFilter | UnavailablePairingFilter)[] {
    const registrationList = this.repository.get();
    const selectedPlayer = this.selectedPlayer.reduce(
      (acc, id) => ({
        ...acc,
        [registrationList.getRankById(id)!!]: id,
      }),
      {} as { [rank: number]: PlayerId }
    );
    const lineups = createLineups(selectedPlayer);
    const result = lineups === 'Not enough players' ? [] : lineups;
    const variationsMatchingFilters = appliedFilters.reduce(
      (acc, filter) => {
        return acc.filter((variation) => {
          return variation.some((pairing) => {
            const newLocal =
              pairing[0].id.equals(filter.player1) &&
              pairing[1].id.equals(filter.player2);
            return newLocal;
          });
        });
      },
      result.flatMap((it) => it.variations)
    );

    const uniqueVariations = sortBy(
      uniqBy(
        variationsMatchingFilters.flatMap((it) => it),
        (it) => `${it[0].position} - ${it[1].position}`
      ),
      [(it) => it[0].position, (it) => it[1].position]
    );
    const remainingVariations = appliedFilters.reduce((acc, filter) => {
      return acc.filter(
        (it) =>
          !(it[0].id.equals(filter.player1) && it[1].id.equals(filter.player2))
      );
    }, uniqueVariations);
    return remainingVariations.map((variation) => ({
      _type: 'Inactive',
      filter: {
        player1: {
          position: variation[0].position,
          id: selectedPlayer[variation[0].position],
        },
        player2: {
          position: variation[1].position,
          id: selectedPlayer[variation[1].position],
        },
      },
    }));
  }
}
