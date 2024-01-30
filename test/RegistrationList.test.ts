import { Player, PlayerId, RegistrationList } from '../app/RegistrationList';
function createValidRegistrationList(list: {
  [rank: number]: Player;
}): RegistrationList {
  const registrationList = RegistrationList.create(list);
  expect(registrationList).toBeInstanceOf(RegistrationList);
  return registrationList as RegistrationList;
}
function createPlayer(name: string): Player {
  return {
    id: PlayerId.create(name),
    name,
  };
}
describe('create a registration list', () => {
  test('non unique id return error', () => {
    const id = PlayerId.create('1');
    const list = RegistrationList.create({
      1: { id, name: 'Test' },
      2: { id, name: 'Test2' },
    });
    expect(list).toBe('PlayerNotUnique');
  });

  test('unique id return list', () => {
    const id1 = PlayerId.create('1');
    const id2 = PlayerId.create('2');
    const list = RegistrationList.create({
      1: { id: id1, name: 'Test' },
      2: { id: id2, name: 'Test2' },
    });
    expect(list).toBeInstanceOf(RegistrationList);
    expect((list as RegistrationList).getList()).toEqual({
      1: { id: id1, name: 'Test' },
      2: { id: id2, name: 'Test2' },
    });
  });
});

describe('remove player', () => {
  test('remove not existing player returns registration list', () => {
    const registrationList = createValidRegistrationList({
      1: createPlayer('Test'),
    });
    const result = registrationList.removePlayer(PlayerId.create('someId'));
    expect(result.getList()).toEqual(registrationList.getList());
  });

  test('removes existing player', () => {
    const existingPlayer = createPlayer('Test');
    const registrationList = createValidRegistrationList({
      1: existingPlayer,
    });
    const result = registrationList.removePlayer(PlayerId.create('someId'));
    expect(result.getList()).toEqual(registrationList.getList());
  });

  describe('add player', () => {
    test('adds player', () => {
      const registrationList = createValidRegistrationList({});
      const player1 = createPlayer('Player 1');
      const result = registrationList.addPlayer(1, player1) as RegistrationList;
      expect(result).toBeInstanceOf(RegistrationList);
      expect(result.getList()).toEqual({ 1: player1 });
    });

    test('cannot add player with same id twice', () => {
      const player1 = createPlayer('Player 1');
      const registrationList = createValidRegistrationList({ 1: player1 });
      const result = registrationList.addPlayer(2, player1);
      expect(result).toBe('Player already exists');
    });

    test('cannot add player on already ranked position', () => {
      const player1 = createPlayer('Player 1');
      const registrationList = createValidRegistrationList({ 1: player1 });
      const player2 = createPlayer('Player 2');
      const result = registrationList.addPlayer(1, player2);
      expect(result).toBe('Rank already taken');
    });

    test('can rank player on current rank', () => {
      const player1 = createPlayer('Player 1');
      const registrationList = createValidRegistrationList({ 1: player1 });
      const result = registrationList.addPlayer(1, player1);
      expect(result).toBeInstanceOf(RegistrationList);
      expect((result as RegistrationList).getList()).toEqual({
        1: player1,
      });
    });
  });

  describe('edit player', () => {
    test('edit name', () => {
      const player1 = createPlayer('Player 1');
      const registrationList = createValidRegistrationList({ 1: player1 });
      const result = registrationList.editPlayer({
        id: player1.id,
        name: 'Player 2',
      });
      expect(result.getList()).toEqual({
        1: { id: player1.id, name: 'Player 2' },
      });
    });
  });
});
