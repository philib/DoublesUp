import { Player, PlayerId, RegistrationList } from '../logic/RegistrationList';
import { RegistrationListRepository } from './RegistrationListRepository';

export class RegistrationListRepositoryInMemory
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

export const InMemoryRepositoryWithPrefilledPlayers = (playersCount: number) =>
  new RegistrationListRepositoryInMemory(
    Array.from(Array(playersCount).keys()).reduce(
      (acc, curr) => ({
        ...acc,
        [(curr + 1).toString()]: {
          name: `Player ${curr + 1}`,
          id: PlayerId.create((curr + 1).toString()),
        },
      }),
      {}
    )
  );
