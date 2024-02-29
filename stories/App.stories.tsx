import { Meta } from '@storybook/react';
import { App } from '../app/components/App/App';
import { ServiceProvider } from '../app/service/useRegistrationListServiceFactory';
import { fakeRepository } from './useFakeService';

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
    <ServiceProvider repo={fakeRepository(28)}>
      <App />
    </ServiceProvider>
  );
};
