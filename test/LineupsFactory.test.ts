import { Lineup, createLineups } from '../app/LineupFactory';

describe('LineupsFactory', () => {
  it('cannot create lineups for less then 6 players', () => {
    const input = {
      1: 'Player 1',
      2: 'Player 2',
      3: 'Player 3',
      4: 'Player 4',
      5: 'Player 5',
    };
    const result = createLineups(input);
    expect(result).toEqual('Not enough players');
  });
  it('creates lineups for 6 players', () => {
    const input = {
      1: 'Player 1',
      2: 'Player 2',
      3: 'Player 3',
      4: 'Player 4',
      5: 'Player 5',
      6: 'Player 6',
    };
    const result = createLineups(input);
    expect(result).toEqual([
      {
        activePlayers: [
          'Player 1',
          'Player 2',
          'Player 3',
          'Player 4',
          'Player 5',
          'Player 6',
        ],
        inactivePlayers: [],
        variations: [
          [
            [
              { position: 1, name: 'Player 1' },
              { position: 2, name: 'Player 2' },
            ],
            [
              { position: 3, name: 'Player 3' },
              { position: 4, name: 'Player 4' },
            ],
            [
              { position: 5, name: 'Player 5' },
              { position: 6, name: 'Player 6' },
            ],
          ],
          [
            [
              { position: 1, name: 'Player 1' },
              { position: 2, name: 'Player 2' },
            ],
            [
              { position: 3, name: 'Player 3' },
              { position: 5, name: 'Player 5' },
            ],
            [
              { position: 4, name: 'Player 4' },
              { position: 6, name: 'Player 6' },
            ],
          ],
          [
            [
              { position: 1, name: 'Player 1' },
              { position: 2, name: 'Player 2' },
            ],
            [
              { position: 3, name: 'Player 3' },
              { position: 6, name: 'Player 6' },
            ],
            [
              { position: 4, name: 'Player 4' },
              { position: 5, name: 'Player 5' },
            ],
          ],
          [
            [
              { position: 1, name: 'Player 1' },
              { position: 2, name: 'Player 2' },
            ],
            [
              { position: 4, name: 'Player 4' },
              { position: 5, name: 'Player 5' },
            ],
            [
              { position: 3, name: 'Player 3' },
              { position: 6, name: 'Player 6' },
            ],
          ],
          [
            [
              { position: 1, name: 'Player 1' },
              { position: 3, name: 'Player 3' },
            ],
            [
              { position: 2, name: 'Player 2' },
              { position: 4, name: 'Player 4' },
            ],
            [
              { position: 5, name: 'Player 5' },
              { position: 6, name: 'Player 6' },
            ],
          ],
          [
            [
              { position: 1, name: 'Player 1' },
              { position: 3, name: 'Player 3' },
            ],
            [
              { position: 2, name: 'Player 2' },
              { position: 5, name: 'Player 5' },
            ],
            [
              { position: 4, name: 'Player 4' },
              { position: 6, name: 'Player 6' },
            ],
          ],
          [
            [
              { position: 1, name: 'Player 1' },
              { position: 3, name: 'Player 3' },
            ],
            [
              { position: 2, name: 'Player 2' },
              { position: 6, name: 'Player 6' },
            ],
            [
              { position: 4, name: 'Player 4' },
              { position: 5, name: 'Player 5' },
            ],
          ],
          [
            [
              { position: 1, name: 'Player 1' },
              { position: 4, name: 'Player 4' },
            ],
            [
              { position: 2, name: 'Player 2' },
              { position: 3, name: 'Player 3' },
            ],
            [
              { position: 5, name: 'Player 5' },
              { position: 6, name: 'Player 6' },
            ],
          ],
          [
            [
              { position: 1, name: 'Player 1' },
              { position: 4, name: 'Player 4' },
            ],
            [
              { position: 2, name: 'Player 2' },
              { position: 5, name: 'Player 5' },
            ],
            [
              { position: 3, name: 'Player 3' },
              { position: 6, name: 'Player 6' },
            ],
          ],
          [
            [
              { position: 1, name: 'Player 1' },
              { position: 4, name: 'Player 4' },
            ],
            [
              { position: 2, name: 'Player 2' },
              { position: 6, name: 'Player 6' },
            ],
            [
              { position: 3, name: 'Player 3' },
              { position: 5, name: 'Player 5' },
            ],
          ],
          [
            [
              { position: 1, name: 'Player 1' },
              { position: 4, name: 'Player 4' },
            ],
            [
              { position: 3, name: 'Player 3' },
              { position: 5, name: 'Player 5' },
            ],
            [
              { position: 2, name: 'Player 2' },
              { position: 6, name: 'Player 6' },
            ],
          ],
          [
            [
              { position: 1, name: 'Player 1' },
              { position: 5, name: 'Player 5' },
            ],
            [
              { position: 2, name: 'Player 2' },
              { position: 4, name: 'Player 4' },
            ],
            [
              { position: 3, name: 'Player 3' },
              { position: 6, name: 'Player 6' },
            ],
          ],
          [
            [
              { position: 1, name: 'Player 1' },
              { position: 5, name: 'Player 5' },
            ],
            [
              { position: 3, name: 'Player 3' },
              { position: 4, name: 'Player 4' },
            ],
            [
              { position: 2, name: 'Player 2' },
              { position: 6, name: 'Player 6' },
            ],
          ],
          [
            [
              { position: 1, name: 'Player 1' },
              { position: 6, name: 'Player 6' },
            ],
            [
              { position: 2, name: 'Player 2' },
              { position: 5, name: 'Player 5' },
            ],
            [
              { position: 3, name: 'Player 3' },
              { position: 4, name: 'Player 4' },
            ],
          ],
          [
            [
              { position: 1, name: 'Player 1' },
              { position: 6, name: 'Player 6' },
            ],
            [
              { position: 3, name: 'Player 3' },
              { position: 4, name: 'Player 4' },
            ],
            [
              { position: 2, name: 'Player 2' },
              { position: 5, name: 'Player 5' },
            ],
          ],
          [
            [
              { position: 2, name: 'Player 2' },
              { position: 3, name: 'Player 3' },
            ],
            [
              { position: 1, name: 'Player 1' },
              { position: 4, name: 'Player 4' },
            ],
            [
              { position: 5, name: 'Player 5' },
              { position: 6, name: 'Player 6' },
            ],
          ],
          [
            [
              { position: 2, name: 'Player 2' },
              { position: 3, name: 'Player 3' },
            ],
            [
              { position: 1, name: 'Player 1' },
              { position: 5, name: 'Player 5' },
            ],
            [
              { position: 4, name: 'Player 4' },
              { position: 6, name: 'Player 6' },
            ],
          ],
          [
            [
              { position: 2, name: 'Player 2' },
              { position: 3, name: 'Player 3' },
            ],
            [
              { position: 1, name: 'Player 1' },
              { position: 6, name: 'Player 6' },
            ],
            [
              { position: 4, name: 'Player 4' },
              { position: 5, name: 'Player 5' },
            ],
          ],
          [
            [
              { position: 2, name: 'Player 2' },
              { position: 4, name: 'Player 4' },
            ],
            [
              { position: 1, name: 'Player 1' },
              { position: 5, name: 'Player 5' },
            ],
            [
              { position: 3, name: 'Player 3' },
              { position: 6, name: 'Player 6' },
            ],
          ],
          [
            [
              { position: 2, name: 'Player 2' },
              { position: 4, name: 'Player 4' },
            ],
            [
              { position: 1, name: 'Player 1' },
              { position: 6, name: 'Player 6' },
            ],
            [
              { position: 3, name: 'Player 3' },
              { position: 5, name: 'Player 5' },
            ],
          ],
          [
            [
              { position: 2, name: 'Player 2' },
              { position: 5, name: 'Player 5' },
            ],
            [
              { position: 1, name: 'Player 1' },
              { position: 6, name: 'Player 6' },
            ],
            [
              { position: 3, name: 'Player 3' },
              { position: 4, name: 'Player 4' },
            ],
          ],
          [
            [
              { position: 3, name: 'Player 3' },
              { position: 4, name: 'Player 4' },
            ],
            [
              { position: 1, name: 'Player 1' },
              { position: 6, name: 'Player 6' },
            ],
            [
              { position: 2, name: 'Player 2' },
              { position: 5, name: 'Player 5' },
            ],
          ],
        ],
      },
    ]);
  });
  it('creates lineups for 7 players', () => {
    const input: { [pos: number]: string } = {
      1: 'Player 1',
      2: 'Player 2',
      3: 'Player 3',
      4: 'Player 4',
      5: 'Player 5',
      6: 'Player 6',
      7: 'Player 7',
    };

    const without = (pos: number) => {
      const copy = { ...input } as { [pos: number]: string };
      delete copy[pos];
      return copy;
    };

    const just = (pos: number) => {
      return [input[pos] as string];
    };
    const lineupWithout = (pos: number) =>
      (createLineups(without(pos)) as Lineup[])[0].variations;

    const resultLineupWithout1 = lineupWithout(1);
    const resultLineupWithout2 = lineupWithout(2);
    const resultLineupWithout3 = lineupWithout(3);
    const resultLineupWithout4 = lineupWithout(4);
    const resultLineupWithout5 = lineupWithout(5);
    const resultLineupWithout6 = lineupWithout(6);
    const resultLineupWithout7 = lineupWithout(7);

    const result = createLineups(input) as Lineup[];

    expect(result.map((r) => r.activePlayers).sort()).toEqual(
      [
        without(7),
        without(6),
        without(5),
        without(4),
        without(3),
        without(2),
        without(1),
      ]
        .map((i) => Object.values(i))
        .sort()
    );
    expect(result.map((r) => r.inactivePlayers).sort()).toEqual(
      [just(7), just(6), just(5), just(4), just(3), just(2), just(1)].sort()
    );
    expect(result.map((r) => r.variations)).toEqual([
      resultLineupWithout1,
      resultLineupWithout2,
      resultLineupWithout3,
      resultLineupWithout4,
      resultLineupWithout5,
      resultLineupWithout6,
      resultLineupWithout7,
    ]);
  });
});
