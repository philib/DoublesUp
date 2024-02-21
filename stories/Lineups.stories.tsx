import { Lineup, createLineups } from '../app/LineupFactory';
import { LineupsComponent } from '../app/Lineups/Lineups';
import { PlayerId } from '../app/RegistrationList';
import { Variation } from '../app/service/RegistrationListService';
import {
  ServiceProvider,
  useService,
} from '../app/service/useRegistrationListServiceFactory';
import { createFakeUseService, fakeRepository } from './useFakeService';

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
  const players = {
    1: PlayerId.create('Player 1'),
    2: PlayerId.create('Player 2'),
    3: PlayerId.create('Player 3'),
    4: PlayerId.create('Player 4'),
    5: PlayerId.create('Player 5'),
    6: PlayerId.create('Player 6'),
    7: PlayerId.create('Player 7'),
    8: PlayerId.create('Player 8'),
    9: PlayerId.create('Player 9'),
  };
  const lineups = createLineups(players) as Lineup[];

  return (
    <>
      <LineupsComponent
        lineups={lineups.map((lineup) => {
          const activePlayers = lineup.activePlayers.map((player) => ({
            id: player,
          }));
          const inactivePlayers = lineup.inactivePlayers.map((player) => ({
            id: player,
          }));
          return {
            activePlayers,
            inactivePlayers,
            variations: lineup.variations.map((variation) => {
              return variation;
            }),
          };
        })}
        getPlayerNameById={(id) =>
          Object.values(players).reduce(
            (acc, players) => ({ ...acc, [players.value]: players.value }),
            {} as { [id: string]: string }
          )[id.value]
        }
        isFavorite={function (f: Variation): boolean {
          return false;
        }}
        favorize={function (f: Variation): void {}}
        unfavorize={function (f: Variation): void {}}
      />
    </>
  );
};
