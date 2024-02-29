import { Meta } from '@storybook/react';
import { App } from '../app/components/App/App';
import { ServiceProvider } from '../app/components/ServiceProvider/useRegistrationListServiceFactory';
import { InMemoryRepositoryWithPrefilledPlayers } from '../app/repository/RegistrationListRepositoryInMemory';

const meta = {
  title: 'App',
  component: App,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<typeof App>;

export default meta;

export const Default = () => {
  return (
    <ServiceProvider repo={InMemoryRepositoryWithPrefilledPlayers(28)}>
      <App />
    </ServiceProvider>
  );
};
