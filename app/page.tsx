'use client';

import { fakeRepository } from '../stories/useFakeService';
import { App } from './components/App/App';
import { ServiceProvider } from './service/useRegistrationListServiceFactory';

export default function Home() {
  return (
    <main>
      <ServiceProvider repo={fakeRepository(2)}>
        <App />
      </ServiceProvider>
    </main>
  );
}
