import exp from 'constants';
import { PlayerId, RegistrationList } from '../../app/RegistrationList';
import { RegistrationListService } from '../../app/service/RegistrationListService';
import { RegistrationListRepositoryFake } from './RegistrationListRepositoryFake';

describe('RegistrationListService', () => {
  it('get list', () => {
    //given
    const initialList = {
      1: { id: PlayerId.create('1'), name: 'Test' },
    };
    const repository = new RegistrationListRepositoryFake();
    repository.save(RegistrationList.create(initialList) as RegistrationList);
    const sut = new RegistrationListService(repository);
    //when
    const result = sut.getList();
    //then
    expect(result.getList()).toBe(initialList);
  });

  it('adds player', () => {
    //given
    const repository = new RegistrationListRepositoryFake();
    const sut = new RegistrationListService(repository);
    //when
    const result = sut.addPlayer(1, { id: PlayerId.create('1'), name: 'Test' });
    //then
    expect(result).toBeInstanceOf(RegistrationList);
    expect(sut.getList().getList()).toEqual({
      1: { id: PlayerId.create('1'), name: 'Test' },
    });
  });

  it('removes player', () => {
    //given
    const initialList = {
      1: { id: PlayerId.create('1'), name: 'Test' },
    };
    const repository = new RegistrationListRepositoryFake();
    repository.save(RegistrationList.create(initialList) as RegistrationList);
    const sut = new RegistrationListService(repository);
    //when
    const result = sut.removePlayer(PlayerId.create('1'));
    //then
    expect(result.getList()).toEqual({});
  });
  it('edits player', () => {
    //given
    const initialList = {
      1: { id: PlayerId.create('1'), name: 'Test' },
    };
    const repository = new RegistrationListRepositoryFake();
    repository.save(RegistrationList.create(initialList) as RegistrationList);
    const sut = new RegistrationListService(repository);
    //when
    const result = sut.editPlayer({
      id: PlayerId.create('1'),
      name: 'Test2',
      rank: 2,
    });
    //then
    expect(result.getList()).toEqual({
      2: { id: PlayerId.create('1'), name: 'Test2' },
    });
  })
});
