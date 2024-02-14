import exp from 'constants';
import { PlayerId, RegistrationList } from '../../app/RegistrationList';
import { RegistrationListService } from '../../app/service/RegistrationListService';
import { RegistrationListRepositoryFake } from './RegistrationListRepositoryFake';
import { Lineup, createLineups } from '../../app/LineupFactory';

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
    const result = sut.editPlayer(PlayerId.create('1'), {
      name: 'Test2',
      rank: 2,
    });
    //then
    expect((result as RegistrationList).getList()).toEqual({
      2: { id: PlayerId.create('1'), name: 'Test2' },
    });
  });
  it('sort player rank', () => {
    //given
    const initialList = {
      1: { id: PlayerId.create('1'), name: 'Test' },
      2: { id: PlayerId.create('2'), name: 'Test2' },
      3: { id: PlayerId.create('3'), name: 'Test3' },
    };
    const repository = new RegistrationListRepositoryFake();
    repository.save(RegistrationList.create(initialList) as RegistrationList);
    const sut = new RegistrationListService(repository);
    //when
    const result = sut.sortPlayer(1, 3);
    //then
    expect((result as RegistrationList).getList()).toEqual({
      1: { id: PlayerId.create('2'), name: 'Test2' },
      2: { id: PlayerId.create('3'), name: 'Test3' },
      3: { id: PlayerId.create('1'), name: 'Test' },
    });
  });

  it('gets player by id', () => {
    //given
    const initialList = {
      1: { id: PlayerId.create('1'), name: 'Test' },
      2: { id: PlayerId.create('2'), name: 'Test2' },
      3: { id: PlayerId.create('3'), name: 'Test3' },
    };
    const repository = new RegistrationListRepositoryFake();
    repository.save(RegistrationList.create(initialList) as RegistrationList);
    const sut = new RegistrationListService(repository);
    //when
    const result = sut.getPlayerById(PlayerId.create('2'));
    //then
    expect(result).toEqual({ id: PlayerId.create('2'), name: 'Test2' });
  });

  it('selection works as expected', () => {
    //given
    const player1 = { id: PlayerId.create('1'), name: 'Test' };
    const repository = new RegistrationListRepositoryFake({
      1: player1,
    });
    const sut = new RegistrationListService(repository);
    expect(sut.getPlayerSelection()).toEqual([]);
    //when
    sut.selectPlayer(player1.id);
    //then
    expect(sut.getPlayerSelection()).toEqual([player1]);
    expect(sut.isPlayerSelected(player1.id)).toBe(true);
    //when
    sut.deselectPlayer(PlayerId.create('1'));
    //then
    expect(sut.getPlayerSelection()).toEqual([]);
    expect(sut.isPlayerSelected(PlayerId.create('1'))).toBe(false);
  });

  it('when player is deleted, selection is removed', () => {
    //given
    const player1 = { id: PlayerId.create('1'), name: 'Test' };
    const repository = new RegistrationListRepositoryFake({
      1: player1,
    });
    const sut = new RegistrationListService(repository);
    sut.selectPlayer(player1.id);
    //when
    sut.removePlayer(player1.id);
    //then
    expect(sut.getPlayerSelection()).toEqual([]);
  });

  it('lineups are created when enough players are selected', () => {
    //given
    const player = (id: number) => ({
      id: PlayerId.create(id.toString()),
      name: `Player ${id}`,
    });
    const players = {
      1: player(1),
      2: player(2),
      3: player(3),
      4: player(4),
      5: player(5),
      6: player(6),
      7: player(7),
      8: player(8),
    };
    const repository = new RegistrationListRepositoryFake(players);
    const sut = new RegistrationListService(repository);

    [player(1), player(2), player(3), player(4), player(5)].forEach((p) => {
      sut.selectPlayer(p.id);
      expect(sut.getLineups()).toEqual([]);
    });

    sut.selectPlayer(player(6).id);
    expect(sut.getLineups().length).toBe(1);

    sut.deselectPlayer(player(6).id);
    expect(sut.getLineups()).toEqual([]);

    sut.selectPlayer(player(6).id);
    expect(sut.getLineups().length).toBe(1);
  });
});
