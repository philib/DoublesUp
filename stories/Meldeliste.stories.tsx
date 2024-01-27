import { Meta, StoryObj } from '@storybook/react';
import { Meldeliste, MeldelistePlayer } from '../app/Meldeliste/Meldeliste';
import { PlayerCard } from '../app/Meldeliste/PlayerCard';

const meta = {
  title: 'Meldeliste',
  component: Meldeliste,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Meldeliste>;
export default meta;

export const Liste = () => {
  return (
    <div style={{ height: '500px', width: '400px', backgroundColor: 'yellow' }}>
      <Meldeliste
        initialPlayers={[
          { rank: 1, name: 'Max Mustermann' },
          { rank: 2, name: 'Petra Mustermann' },
        ]}
        onPlayerListModified={function (players: MeldelistePlayer[]): void {
          console.log(JSON.stringify(players));
        }}
      />
    </div>
  );
};

export const Spieler = () => {
  return <PlayerCard rank={1} name="Max Mustermann" />;
};
