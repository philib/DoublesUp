'use client';

import { InMemoryRepositoryWithPrefilledPlayers } from './repository/RegistrationListRepositoryInMemory';
import { App } from './components/App/App';
import { ServiceProvider } from './service/useRegistrationListServiceFactory';

export default function Home() {
  return (
    <main>
      <ServiceProvider repo={InMemoryRepositoryWithPrefilledPlayers(2)}>
        <App />
      </ServiceProvider>
    </main>
  );
}
