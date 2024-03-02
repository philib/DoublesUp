import { every, some, without } from 'lodash';
import {
  createLineups,
  filterLineupsByPairings,
  filterLineupsByVariations,
  getFilterStatus,
} from '../app/LineupFactory';
import { PlayerId } from '../app/RegistrationList';
import { getPermutations } from '../app/getPermutations';

const playerId = (id: number) => PlayerId.create(`Player ${id}`);

describe('LineupsFactory', () => {
  it('cannot create lineups for less then 6 players', () => {
    const input = [
      playerId(1),
      playerId(2),
      playerId(3),
      playerId(4),
      playerId(5),
    ];
    const result = createLineups(input);
    expect(result).toEqual([]);
  });
  it('creates lineups for 6 players', () => {
    const input = [
      playerId(1),
      playerId(2),
      playerId(3),
      playerId(4),
      playerId(5),
      playerId(6),
    ];
    const result = createLineups(input);
    expect(result).toEqual([
      {
        activePlayers: [
          playerId(1),
          playerId(2),
          playerId(3),
          playerId(4),
          playerId(5),
          playerId(6),
        ],
        inactivePlayers: [],
        variations: [
          [
            [
              { position: 1, value: playerId(1) },
              { position: 2, value: playerId(2) },
            ],
            [
              { position: 3, value: playerId(3) },
              { position: 4, value: playerId(4) },
            ],
            [
              { position: 5, value: playerId(5) },
              { position: 6, value: playerId(6) },
            ],
          ],
          [
            [
              { position: 1, value: playerId(1) },
              { position: 2, value: playerId(2) },
            ],
            [
              { position: 3, value: playerId(3) },
              { position: 5, value: playerId(5) },
            ],
            [
              { position: 4, value: playerId(4) },
              { position: 6, value: playerId(6) },
            ],
          ],
          [
            [
              { position: 1, value: playerId(1) },
              { position: 2, value: playerId(2) },
            ],
            [
              { position: 3, value: playerId(3) },
              { position: 6, value: playerId(6) },
            ],
            [
              { position: 4, value: playerId(4) },
              { position: 5, value: playerId(5) },
            ],
          ],
          [
            [
              { position: 1, value: playerId(1) },
              { position: 2, value: playerId(2) },
            ],
            [
              { position: 4, value: playerId(4) },
              { position: 5, value: playerId(5) },
            ],
            [
              { position: 3, value: playerId(3) },
              { position: 6, value: playerId(6) },
            ],
          ],
          [
            [
              { position: 1, value: playerId(1) },
              { position: 3, value: playerId(3) },
            ],
            [
              { position: 2, value: playerId(2) },
              { position: 4, value: playerId(4) },
            ],
            [
              { position: 5, value: playerId(5) },
              { position: 6, value: playerId(6) },
            ],
          ],
          [
            [
              { position: 1, value: playerId(1) },
              { position: 3, value: playerId(3) },
            ],
            [
              { position: 2, value: playerId(2) },
              { position: 5, value: playerId(5) },
            ],
            [
              { position: 4, value: playerId(4) },
              { position: 6, value: playerId(6) },
            ],
          ],
          [
            [
              { position: 1, value: playerId(1) },
              { position: 3, value: playerId(3) },
            ],
            [
              { position: 2, value: playerId(2) },
              { position: 6, value: playerId(6) },
            ],
            [
              { position: 4, value: playerId(4) },
              { position: 5, value: playerId(5) },
            ],
          ],
          [
            [
              { position: 1, value: playerId(1) },
              { position: 4, value: playerId(4) },
            ],
            [
              { position: 2, value: playerId(2) },
              { position: 3, value: playerId(3) },
            ],
            [
              { position: 5, value: playerId(5) },
              { position: 6, value: playerId(6) },
            ],
          ],
          [
            [
              { position: 1, value: playerId(1) },
              { position: 4, value: playerId(4) },
            ],
            [
              { position: 2, value: playerId(2) },
              { position: 5, value: playerId(5) },
            ],
            [
              { position: 3, value: playerId(3) },
              { position: 6, value: playerId(6) },
            ],
          ],
          [
            [
              { position: 1, value: playerId(1) },
              { position: 4, value: playerId(4) },
            ],
            [
              { position: 2, value: playerId(2) },
              { position: 6, value: playerId(6) },
            ],
            [
              { position: 3, value: playerId(3) },
              { position: 5, value: playerId(5) },
            ],
          ],
          [
            [
              { position: 1, value: playerId(1) },
              { position: 4, value: playerId(4) },
            ],
            [
              { position: 3, value: playerId(3) },
              { position: 5, value: playerId(5) },
            ],
            [
              { position: 2, value: playerId(2) },
              { position: 6, value: playerId(6) },
            ],
          ],
          [
            [
              { position: 1, value: playerId(1) },
              { position: 5, value: playerId(5) },
            ],
            [
              { position: 2, value: playerId(2) },
              { position: 4, value: playerId(4) },
            ],
            [
              { position: 3, value: playerId(3) },
              { position: 6, value: playerId(6) },
            ],
          ],
          [
            [
              { position: 1, value: playerId(1) },
              { position: 5, value: playerId(5) },
            ],
            [
              { position: 3, value: playerId(3) },
              { position: 4, value: playerId(4) },
            ],
            [
              { position: 2, value: playerId(2) },
              { position: 6, value: playerId(6) },
            ],
          ],
          [
            [
              { position: 1, value: playerId(1) },
              { position: 6, value: playerId(6) },
            ],
            [
              { position: 2, value: playerId(2) },
              { position: 5, value: playerId(5) },
            ],
            [
              { position: 3, value: playerId(3) },
              { position: 4, value: playerId(4) },
            ],
          ],
          [
            [
              { position: 1, value: playerId(1) },
              { position: 6, value: playerId(6) },
            ],
            [
              { position: 3, value: playerId(3) },
              { position: 4, value: playerId(4) },
            ],
            [
              { position: 2, value: playerId(2) },
              { position: 5, value: playerId(5) },
            ],
          ],
          [
            [
              { position: 2, value: playerId(2) },
              { position: 3, value: playerId(3) },
            ],
            [
              { position: 1, value: playerId(1) },
              { position: 4, value: playerId(4) },
            ],
            [
              { position: 5, value: playerId(5) },
              { position: 6, value: playerId(6) },
            ],
          ],
          [
            [
              { position: 2, value: playerId(2) },
              { position: 3, value: playerId(3) },
            ],
            [
              { position: 1, value: playerId(1) },
              { position: 5, value: playerId(5) },
            ],
            [
              { position: 4, value: playerId(4) },
              { position: 6, value: playerId(6) },
            ],
          ],
          [
            [
              { position: 2, value: playerId(2) },
              { position: 3, value: playerId(3) },
            ],
            [
              { position: 1, value: playerId(1) },
              { position: 6, value: playerId(6) },
            ],
            [
              { position: 4, value: playerId(4) },
              { position: 5, value: playerId(5) },
            ],
          ],
          [
            [
              { position: 2, value: playerId(2) },
              { position: 4, value: playerId(4) },
            ],
            [
              { position: 1, value: playerId(1) },
              { position: 5, value: playerId(5) },
            ],
            [
              { position: 3, value: playerId(3) },
              { position: 6, value: playerId(6) },
            ],
          ],
          [
            [
              { position: 2, value: playerId(2) },
              { position: 4, value: playerId(4) },
            ],
            [
              { position: 1, value: playerId(1) },
              { position: 6, value: playerId(6) },
            ],
            [
              { position: 3, value: playerId(3) },
              { position: 5, value: playerId(5) },
            ],
          ],
          [
            [
              { position: 2, value: playerId(2) },
              { position: 5, value: playerId(5) },
            ],
            [
              { position: 1, value: playerId(1) },
              { position: 6, value: playerId(6) },
            ],
            [
              { position: 3, value: playerId(3) },
              { position: 4, value: playerId(4) },
            ],
          ],
          [
            [
              { position: 3, value: playerId(3) },
              { position: 4, value: playerId(4) },
            ],
            [
              { position: 1, value: playerId(1) },
              { position: 6, value: playerId(6) },
            ],
            [
              { position: 2, value: playerId(2) },
              { position: 5, value: playerId(5) },
            ],
          ],
        ],
      },
    ]);
  });
  it('creates lineups for 7 players', () => {
    const input = [
      playerId(1),
      playerId(2),
      playerId(3),
      playerId(4),
      playerId(5),
      playerId(6),
      playerId(7),
    ];

    const just = (pos: number) => {
      return [input[pos - 1] as PlayerId];
    };
    const lineupWithout = (pos: number) =>
      createLineups(without(input, input[pos - 1]))[0].variations;

    const result = createLineups(input);

    expect(result.map((r) => r.activePlayers)).toEqual(
      [
        without(input, input[6]),
        without(input, input[5]),
        without(input, input[4]),
        without(input, input[3]),
        without(input, input[2]),
        without(input, input[1]),
        without(input, input[0]),
      ]
        .map((i) => Object.values(i))
        .sort()
    );
    expect(result.map((r) => r.inactivePlayers)).toEqual([
      just(7),
      just(6),
      just(5),
      just(4),
      just(3),
      just(2),
      just(1),
    ]);

    const resultLineupWithout1 = lineupWithout(1);
    const resultLineupWithout2 = lineupWithout(2);
    const resultLineupWithout3 = lineupWithout(3);
    const resultLineupWithout4 = lineupWithout(4);
    const resultLineupWithout5 = lineupWithout(5);
    const resultLineupWithout6 = lineupWithout(6);
    const resultLineupWithout7 = lineupWithout(7);

    expect(result.map((r) => r.variations)).toEqual([
      resultLineupWithout7,
      resultLineupWithout6,
      resultLineupWithout5,
      resultLineupWithout4,
      resultLineupWithout3,
      resultLineupWithout2,
      resultLineupWithout1,
    ]);
  });

  it('creates lineups for 8 players', () => {
    const input = [
      playerId(1),
      playerId(2),
      playerId(3),
      playerId(4),
      playerId(5),
      playerId(6),
      playerId(7),
      playerId(8),
    ];

    const result = createLineups(input);

    expect(result.map((r) => r.activePlayers)).toEqual(
      [
        [1, 2, 3, 4, 5, 6], //
        [1, 2, 3, 4, 5, 7],
        [1, 2, 3, 4, 5, 8],
        [1, 2, 3, 4, 6, 7],
        [1, 2, 3, 4, 6, 8],
        [1, 2, 3, 4, 7, 8],
        [1, 2, 3, 5, 6, 7],
        [1, 2, 3, 5, 6, 8],
        [1, 2, 3, 5, 7, 8],
        [1, 2, 3, 6, 7, 8],
        [1, 2, 4, 5, 6, 7],
        [1, 2, 4, 5, 6, 8],
        [1, 2, 4, 5, 7, 8],
        [1, 2, 4, 6, 7, 8],
        [1, 2, 5, 6, 7, 8],
        [1, 3, 4, 5, 6, 7],
        [1, 3, 4, 5, 6, 8],
        [1, 3, 4, 5, 7, 8],
        [1, 3, 4, 6, 7, 8],
        [1, 3, 5, 6, 7, 8],
        [1, 4, 5, 6, 7, 8],
        [2, 3, 4, 5, 6, 7],
        [2, 3, 4, 5, 6, 8],
        [2, 3, 4, 5, 7, 8],
        [2, 3, 4, 6, 7, 8],
        [2, 3, 5, 6, 7, 8],
        [2, 4, 5, 6, 7, 8],
        [3, 4, 5, 6, 7, 8],
      ].map((a) => a.map((b) => playerId(b)))
    );
    expect(result.map((r) => r.inactivePlayers)).toEqual(
      [
        [7, 8],
        [6, 8],
        [6, 7],
        [5, 8],
        [5, 7],
        [5, 6],
        [4, 8],
        [4, 7],
        [4, 6],
        [4, 5],
        [3, 8],
        [3, 7],
        [3, 6],
        [3, 5],
        [3, 4],
        [2, 8],
        [2, 7],
        [2, 6],
        [2, 5],
        [2, 4],
        [2, 3],
        [1, 8],
        [1, 7],
        [1, 6],
        [1, 5],
        [1, 4],
        [1, 3],
        [1, 2],
      ].map((a) => a.map((b) => playerId(b)))
    );
  });
  describe('lineup filtering', () => {
    it('lineups can be filtered by doubles players', () => {
      //given
      const player = (id: number) => ({
        id: PlayerId.create(id.toString()),
        name: `Player ${id}`,
      });
      const players = [
        player(1).id,
        player(2).id,
        player(3).id,
        player(4).id,
        player(5).id,
        player(6).id,
        player(7).id,
        player(8).id,
      ];

      const lineups = createLineups(players);

      const filteredByPairing = filterLineupsByPairings(
        lineups,
        [{ player1: player(1).id, player2: player(6).id }],
        (a: PlayerId, b: PlayerId) => a.equals(b)
      );

      expect(
        every(filteredByPairing, (lineup) =>
          every(lineup.variations, (variation) =>
            some(
              variation,
              ([{ value: id1 }, { value: id2 }]) =>
                player(1).id.equals(id1) || player(6).id.equals(id2)
            )
          )
        )
      );
      expect(
        filteredByPairing.some((lineup) =>
          lineup.inactivePlayers.some((p) => p.equals(player(1).id))
        )
      ).toBe(false);

      filteredByPairing.forEach((lineup) => {
        lineup.variations.forEach((variation) => {
          expect(
            variation.some(
              (pairing) =>
                pairing[0].value.equals(player(1).id) &&
                pairing[1].value.equals(player(6).id)
            )
          ).toBe(true);
        });
      });
    });

    it('getFilterStatus for no active filters returns all possible pairing filters', () => {
      //given
      const player = (id: number) => ({
        id: PlayerId.create(id.toString()),
        name: `Player ${id}`,
      });
      const players = [
        player(1).id,
        player(2).id,
        player(3).id,
        player(4).id,
        player(5).id,
        player(6).id,
        player(7).id,
        player(8).id,
      ];
      const lineups = createLineups(players);

      const playersToInactiveFilters = (ids: PlayerId[]) =>
        getPermutations(ids, 2).map((permutation) => ({
          filter: { player1: permutation[0], player2: permutation[1] },
        }));

      expect(getFilterStatus(lineups, (a, b) => a.equals(b), [])).toEqual(
        playersToInactiveFilters([
          player(1).id,
          player(2).id,
          player(3).id,
          player(4).id,
          player(5).id,
          player(6).id,
          player(7).id,
          player(8).id,
        ])
      );
    });

    it('getFilterStatus for active filter return all possible remaining filters', () => {
      //given
      const player = (id: number) => PlayerId.create(id.toString());
      const players = [
        player(1),
        player(2),
        player(3),
        player(4),
        player(5),
        player(6),
        player(7),
      ];
      const lineups = createLineups(players);
      expect(
        getFilterStatus(lineups, (a, b) => a.equals(b), [
          {
            player1: player(1),
            player2: player(2),
          },
        ])
      ).toEqual(
        [
          [3, 4],
          [3, 5],
          [3, 6],
          [3, 7],
          [4, 5],
          [4, 6],
          [4, 7],
          [5, 6],
          [5, 7],
          [6, 7],
        ].map((pairing) => ({
          filter: {
            player1: player(pairing[0]),
            player2: player(pairing[1]),
          },
        }))
      );

      expect(
        getFilterStatus(lineups, (a, b) => a.equals(b), [
          {
            player1: player(1),
            player2: player(2),
          },
          {
            player1: player(3),
            player2: player(6),
          },
        ])
      ).toEqual(
        [
          [4, 5],
          [4, 7],
          [5, 7],
        ].map((pairing) => ({
          filter: {
            player1: player(pairing[0]),
            player2: player(pairing[1]),
          },
        }))
      );
    });
    it('filters lineups by variations', () => {
      //given
      const player = (id: number) => ({
        id: PlayerId.create(id.toString()),
        name: `Player ${id}`,
      });
      const players = [
        player(1).id,
        player(2).id,
        player(3).id,
        player(4).id,
        player(5).id,
        player(6).id,
        player(7).id,
        player(8).id,
      ];

      const lineups = createLineups(players);

      const filteredByVariations = filterLineupsByVariations(lineups, [
        {
          doubles1: {
            player1: player(1).id,
            player2: player(6).id,
          },
          doubles2: {
            player1: player(2).id,
            player2: player(7).id,
          },
          doubles3: {
            player1: player(3).id,
            player2: player(8).id,
          },
        },
        {
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
        },
      ]);
      expect(filteredByVariations).toEqual([
        {
          activePlayers: [
            player(1).id,
            player(2).id,
            player(3).id,
            player(4).id,
            player(5).id,
            player(6).id,
          ],
          inactivePlayers: [player(7).id, player(8).id],
          variations: [
            [
              [
                { position: 1, value: player(1).id },
                { position: 2, value: player(2).id },
              ],
              [
                { position: 3, value: player(3).id },
                { position: 4, value: player(4).id },
              ],
              [
                { position: 5, value: player(5).id },
                { position: 6, value: player(6).id },
              ],
            ],
          ],
        },
        {
          activePlayers: [
            player(1).id,
            player(2).id,
            player(3).id,
            player(6).id,
            player(7).id,
            player(8).id,
          ],
          inactivePlayers: [player(4).id, player(5).id],
          variations: [
            [
              [
                { position: 1, value: player(1).id },
                { position: 4, value: player(6).id },
              ],
              [
                { position: 2, value: player(2).id },
                { position: 5, value: player(7).id },
              ],
              [
                { position: 3, value: player(3).id },
                { position: 6, value: player(8).id },
              ],
            ],
          ],
        },
      ]);
    });
  });
});
