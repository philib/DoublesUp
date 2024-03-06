import { Meta } from '@storybook/react';
import { StaticRegistrationList } from '../app/components/StaticRegistrationList/StaticRegistrationList';
import { readTeams } from '../app/teams/readTeams';

const meta = {
  title: 'Static Registration List',
  component: StaticRegistrationList,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<typeof StaticRegistrationList>;

export default meta;

export const Default = () => {
  const teams = readTeams({
    'Team 1': { 1: 'Player 1', 2: 'Player 2' },
    'Team 2': { 3: 'Player 3', 4: 'Player 4' },
  });
  return <StaticRegistrationList teams={teams} onSelectionChanged={() => {}} />;
};
