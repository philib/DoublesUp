import { RegistrationList } from '../../app/RegistrationList';
import { RegistrationListRepository } from '../../app/repository/RegistrationListRepository';

export class RegistrationListRepositoryFake
  implements RegistrationListRepository
{
  registrationList: RegistrationList;
  constructor() {
    this.registrationList = RegistrationList.create({}) as RegistrationList;
  }
  save(registrationList: RegistrationList): void {
    this.registrationList = registrationList;
  }
  get(): RegistrationList {
    return this.registrationList!!;
  }
}
