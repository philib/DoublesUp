'use client';
import React from 'react';

import { InMemoryRepositoryWithPrefilledPlayers } from './repository/RegistrationListRepositoryInMemory';
import { App } from './components/App/App';
import { ServiceProvider } from './components/ServiceProvider/useRegistrationListServiceFactory';

import { MyIntlProvider } from './MyIntlProvider';

const Home: React.FC = (props) => {
  return (
    <main>
      <MyIntlProvider>
        <ServiceProvider repo={InMemoryRepositoryWithPrefilledPlayers(8)}>
          <App {...props} />
        </ServiceProvider>
      </MyIntlProvider>
    </main>
  );
};
export default Home;
