import { sortBy } from 'lodash';
import { Player, PlayerId, RegistrationList } from '../RegistrationList';
import { RegistrationListRepository } from '../repository/RegistrationListRepository';

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
}
