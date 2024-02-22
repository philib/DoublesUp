import { sortBy, uniqBy } from 'lodash';
import { Player, PlayerId, RegistrationList } from '../RegistrationList';
import { RegistrationListRepository } from '../repository/RegistrationListRepository';
import { InactivePairingFilter, Lineup, createLineups } from '../LineupFactory';

export type Variation = {
  doubles1: { player1: PlayerId; player2: PlayerId };
  doubles2: { player1: PlayerId; player2: PlayerId };
  doubles3: { player1: PlayerId; player2: PlayerId };
};

export const isEqual = (v1: Variation) => (v2: Variation) =>
  hashVariation(v1) === hashVariation(v2);

const hashVariation = (it: Variation) =>
  `{${it.doubles1.player1.value},${it.doubles1.player2.value} - ${it.doubles2.player1.value},${it.doubles2.player2.value} - ${it.doubles3.player1.value},${it.doubles3.player2.value}}`;

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
  filterLineups(
    lineups: Lineup[],
    filter: { player1: PlayerId; player2: PlayerId }[] = []
  ): Lineup[] {
    const lineupsWithPlayersPlaying = filter.reduce((acc, filter) => {
      return acc.filter((lineup) => {
        const player1Playing = lineup.activePlayers.find((player) =>
          player.equals(filter.player1)
        );
        const player2Playing = lineup.activePlayers.find((player) =>
          player.equals(filter.player2)
        );
        return player1Playing && player2Playing;
      });
    }, lineups);

    const withFilteredVariations = lineupsWithPlayersPlaying.map((lineup) => ({
      ...lineup,
      variations: filter.reduce((acc, filter) => {
        return acc.filter((variation) => {
          return variation.some((pairing) => {
            const newLocal =
              pairing[0].id.equals(filter.player1) &&
              pairing[1].id.equals(filter.player2);
            return newLocal;
          });
        });
      }, lineup.variations),
    }));

    return withFilteredVariations;
  }
  getAvailableFilters(
    appliedFilters: { player1: PlayerId; player2: PlayerId }[]
  ): InactivePairingFilter[] {
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
      filter: {
        player1: selectedPlayer[variation[0].position],
        player2: selectedPlayer[variation[1].position],
      },
    }));
  }
}
