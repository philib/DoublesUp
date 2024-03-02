import { useState } from 'react';
import { Lineup, createLineups } from '../app/LineupFactory';
import { LineupsComponent } from '../app/components/Lineups/Lineups';
import { PlayerId } from '../app/RegistrationList';
import { Meta } from '@storybook/react';

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
  const players = [
    PlayerId.create('Player 1'),
    PlayerId.create('Player 2'),
    PlayerId.create('Player 3'),
    PlayerId.create('Player 4'),
    PlayerId.create('Player 5'),
    PlayerId.create('Player 6'),
    PlayerId.create('Player 7'),
    PlayerId.create('Player 8'),
    PlayerId.create('Player 9'),
  ];
  const [lineups, setLineups] = useState(
    createLineups(players) as Lineup<PlayerId>[]
  );

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
      />
    </>
  );
};
