import { Lineup, createLineups } from '../app/LineupFactory';
import { LineupsComponent } from '../app/Lineups/Lineups';
import { createFakeUseService } from './useFakeService';

const meta = {
  title: 'Lineups',
  component: LineupsComponent,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<typeof LineupsComponent>;

export default meta;

export const Default = () => {
  const lineups = createLineups({
    1: 'Player 1',
    2: 'Player 2',
    3: 'Player 3',
    4: 'Player 4',
    5: 'Player 5',
    6: 'Player 6',
    7: 'Player 7',
    8: 'Player 8',
    9: 'Player 9',
  }) as Lineup[];

  return (
    <>
      Total Variations:{' '}
      {lineups.reduce((acc, lineup) => {
        return acc + lineup.variations.length;
      }, 0)}
      <LineupsComponent
        lineups={lineups.map((lineup) => {
          const activePlayers = lineup.activePlayers.map((player) => ({
            name: player,
          }));
          const inactivePlayers = lineup.inactivePlayers.map((player) => ({
            name: player,
          }));
          return {
            activePlayers,
            inactivePlayers,
            variations: lineup.variations.map((variation) => {
              return variation;
            }),
          };
        })}
      />
    </>
  );
};
