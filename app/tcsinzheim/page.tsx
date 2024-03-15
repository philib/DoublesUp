'use client';
import React from 'react';

import teams from './teams.json';
import { MyIntlProvider } from '../MyIntlProvider';
import { StaticApp } from '../components/App/StaticApp';
import { readTeams } from '../teams/readTeams';
import Logo from './logo.png';

const Home: React.FC = (props) => {
  return (
    <main>
      <MyIntlProvider>
        <StaticApp icon={<img src={Logo.src} height={'65px'} />} teams={readTeams(teams)} {...props} />
      </MyIntlProvider>
    </main>
  );
};
export default Home;
