import { PlayerId } from '../app/RegistrationList';
import { createUseService } from '../app/service/useRegistrationListServiceFactory';
import { RegistrationListRepositoryFake } from '../test/service/RegistrationListRepositoryFake';

export const fakeRepository = (playersCount: number) =>
  new RegistrationListRepositoryFake(
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
export const createFakeUseService = (playersCount: number) =>
  createUseService(fakeRepository(playersCount));
