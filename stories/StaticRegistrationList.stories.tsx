import { Meta } from '@storybook/react';
import { StaticRegistrationList } from '../app/components/StaticRegistrationList/StaticRegistrationList';
import { teamConfig } from '../team.config';

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
  return (
    <StaticRegistrationList
      teams={teamConfig.teams}
      onSelectionChanged={() => {}}
    />
  );
};
