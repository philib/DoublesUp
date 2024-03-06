'use client';
import React from 'react';

import teams from './teams.json';
import { MyIntlProvider } from '../MyIntlProvider';
import { StaticApp } from '../components/App/StaticApp';
import { readTeams } from '../teams/readTeams';

const Home: React.FC = (props) => {
  return (
    <main>
      <MyIntlProvider>
        <StaticApp teams={readTeams(teams)} {...props} />
      </MyIntlProvider>
    </main>
  );
};
export default Home;
