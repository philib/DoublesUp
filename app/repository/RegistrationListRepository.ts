import { RegistrationList } from '../RegistrationList';

export interface RegistrationListRepository {
  save(registrationList: RegistrationList): void;
  get(): RegistrationList;
}
