import { Player, PlayerId, RegistrationList } from '../RegistrationList';
import { RegistrationListRepository } from '../repository/RegistrationListRepository';

export class RegistrationListService {
  repository: RegistrationListRepository;
  constructor(repository: RegistrationListRepository) {
    this.repository = repository;
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
}
