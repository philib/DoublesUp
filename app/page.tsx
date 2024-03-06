'use client';
import React from 'react';
import { MyIntlProvider } from './MyIntlProvider';
import { DynamicApp } from './components/App/DynamicApp';
import { ServiceProvider } from './components/ServiceProvider/useRegistrationListServiceFactory';
import { InMemoryRepositoryWithPrefilledPlayers } from './repository/RegistrationListRepositoryInMemory';

const HomePage: React.FC = (props) => {
  return (
    <main>
      <MyIntlProvider>
        <ServiceProvider repo={InMemoryRepositoryWithPrefilledPlayers(8)}>
          <DynamicApp {...props} />
        </ServiceProvider>
      </MyIntlProvider>
    </main>
  );
};
export default HomePage;
