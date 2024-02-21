import { PlayerId, RegistrationList } from '../../app/RegistrationList';
import { getPermutations } from '../../app/getPermutations';
import { RegistrationListService } from '../../app/service/RegistrationListService';
import { RegistrationListRepositoryFake } from './RegistrationListRepositoryFake';
import { every, some } from 'lodash';

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
  it('lineups can be filtered by single players', () => {
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

    [
      player(1),
      player(2),
      player(3),
      player(4),
      player(5),
      player(6),
      player(7),
    ].forEach((p) => {
      sut.selectPlayer(p.id);
    });
    const filteredByOnePlayer = sut.getLineups([player(1).id]);

    expect(
      filteredByOnePlayer.map((l) => l.inactivePlayers)
    ).not.toContainEqual([player(1).id]);
    expect(filteredByOnePlayer.map((l) => l.activePlayers)).toEqual([
      [
        player(1).id,
        player(2).id,
        player(3).id,
        player(4).id,
        player(5).id,
        player(6).id,
      ],
      [
        player(1).id,
        player(2).id,
        player(3).id,
        player(4).id,
        player(5).id,
        player(7).id,
      ],
      [
        player(1).id,
        player(2).id,
        player(3).id,
        player(4).id,
        player(6).id,
        player(7).id,
      ],
      [
        player(1).id,
        player(2).id,
        player(3).id,
        player(5).id,
        player(6).id,
        player(7).id,
      ],
      [
        player(1).id,
        player(2).id,
        player(4).id,
        player(5).id,
        player(6).id,
        player(7).id,
      ],
      [
        player(1).id,
        player(3).id,
        player(4).id,
        player(5).id,
        player(6).id,
        player(7).id,
      ],
    ]);

    expect(
      every(filteredByOnePlayer, (lineup) => {
        return lineup.activePlayers.find((p) => p.equals(player(1).id));
      })
    ).toBe(true);

    expect(
      every(filteredByOnePlayer, (lineup) =>
        every(lineup.variations, (variation) =>
          some(
            variation,
            ([{ id: id1 }, { id: id2 }]) =>
              player(1).id.equals(id1) || player(1).id.equals(id2)
          )
        )
      )
    );
    const filteredByTwoPlayer = sut.getLineups([player(1).id, player(7).id]);

    expect(
      filteredByTwoPlayer.map((l) => l.inactivePlayers)
    ).not.toContainEqual([player(1).id]);
    expect(
      filteredByTwoPlayer.map((l) => l.inactivePlayers)
    ).not.toContainEqual([player(7).id]);
    expect(filteredByTwoPlayer.map((l) => l.activePlayers)).toEqual([
      [
        player(1).id,
        player(2).id,
        player(3).id,
        player(4).id,
        player(5).id,
        player(7).id,
      ],
      [
        player(1).id,
        player(2).id,
        player(3).id,
        player(4).id,
        player(6).id,
        player(7).id,
      ],
      [
        player(1).id,
        player(2).id,
        player(3).id,
        player(5).id,
        player(6).id,
        player(7).id,
      ],
      [
        player(1).id,
        player(2).id,
        player(4).id,
        player(5).id,
        player(6).id,
        player(7).id,
      ],
      [
        player(1).id,
        player(3).id,
        player(4).id,
        player(5).id,
        player(6).id,
        player(7).id,
      ],
    ]);

    expect(
      every(filteredByTwoPlayer, (lineup) => {
        return (
          lineup.activePlayers.find((p) => p.equals(player(1).id)) &&
          lineup.activePlayers.find((p) => p.equals(player(7).id))
        );
      })
    ).toBe(true);

    expect(
      every(filteredByOnePlayer, (lineup) =>
        every(
          lineup.variations,
          (variation) =>
            some(
              variation,
              ([{ id: id1 }, { id: id2 }]) =>
                player(1).id.equals(id1) || player(1).id.equals(id2)
            ) &&
            some(
              variation,
              ([{ id: id1 }, { id: id2 }]) =>
                player(7).id.equals(id1) || player(7).id.equals(id2)
            )
        )
      )
    );
  });

  describe('available filters', () => {
    it('with no filters applied, return all possible filters', () => {
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

      [
        player(1),
        player(2),
        player(3),
        player(4),
        player(5),
        player(6),
      ].forEach((p) => {
        sut.selectPlayer(p.id);
      });

      const playersToInactiveFilters = (ids: PlayerId[]) =>
        getPermutations(ids, 2).map((permutation) => ({
          filter: { player1: permutation[0], player2: permutation[1] },
        }));

      expect(sut.getAvailableFilters([])).toEqual(
        playersToInactiveFilters([
          player(1).id,
          player(2).id,
          player(3).id,
          player(4).id,
          player(5).id,
          player(6).id,
        ])
      );

      expect(
        sut.getAvailableFilters([
          {
            player1: player(1).id,
            player2: player(2).id,
          },
        ])
      ).toEqual(
        [
          [3, 4],
          [3, 5],
          [3, 6],
          [4, 5],
          [4, 6],
          [5, 6],
        ].map((pairing) => ({
          filter: {
            player1: player(pairing[0]).id,
            player2: player(pairing[1]).id,
          },
        }))
      );
    });
    it('with some filters applied, return all remaining possible filters', () => {});
  });

  describe('favorization of lineup variations', () => {
    it('favorizing lineup variation', () => {
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

      const variation1 = {
        doubles1: {
          player1: player(1).id,
          player2: player(2).id,
        },
        doubles2: {
          player1: player(3).id,
          player2: player(4).id,
        },
        doubles3: {
          player1: player(5).id,
          player2: player(6).id,
        },
      };
      const result = sut.isVariationFavorized(variation1);
      expect(result).toBe(false);

      sut.favorizeVariation(variation1);
      expect(sut.isVariationFavorized(variation1)).toBe(true);

      const variation2 = {
        doubles1: {
          player1: player(1).id,
          player2: player(2).id,
        },
        doubles2: {
          player1: player(3).id,
          player2: player(6).id,
        },
        doubles3: {
          player1: player(4).id,
          player2: player(7).id,
        },
      };
      sut.favorizeVariation(variation2);
      expect(sut.isVariationFavorized(variation1)).toBe(true);
      expect(sut.isVariationFavorized(variation2)).toBe(true);

      sut.unfavorizeVariation(variation1);
      expect(sut.isVariationFavorized(variation1)).toBe(false);
      expect(sut.isVariationFavorized(variation2)).toBe(true);
    });
  });
});
