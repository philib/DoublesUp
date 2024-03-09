import { RegistrationList } from '../logic/RegistrationList';

export interface RegistrationListRepository {
  save(registrationList: RegistrationList): void;
  get(): RegistrationList;
}
