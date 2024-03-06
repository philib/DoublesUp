import { Meta } from '@storybook/react';
import { DynamicApp } from '../app/components/App/DynamicApp';
import { ServiceProvider } from '../app/components/ServiceProvider/useRegistrationListServiceFactory';
import { InMemoryRepositoryWithPrefilledPlayers } from '../app/repository/RegistrationListRepositoryInMemory';
import { MyIntlProvider } from '../app/MyIntlProvider';

const meta = {
  title: 'App',
  component: DynamicApp,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<typeof DynamicApp>;

export default meta;

export const Default = () => {
  return (
    <MyIntlProvider>
      <ServiceProvider repo={InMemoryRepositoryWithPrefilledPlayers(28)}>
        <DynamicApp />
      </ServiceProvider>
    </MyIntlProvider>
  );
};
