import { Player, RegistrationList } from '../../app/RegistrationList';
import { RegistrationListRepository } from '../../app/repository/RegistrationListRepository';

export class RegistrationListRepositoryFake
  implements RegistrationListRepository
{
  registrationList: RegistrationList;
  constructor(list: { [rank: number]: Player } = {}) {
    this.registrationList = RegistrationList.create(list) as RegistrationList;
  }
  save(registrationList: RegistrationList): void {
    this.registrationList = registrationList;
  }
  get(): RegistrationList {
    return this.registrationList!!;
  }
}
