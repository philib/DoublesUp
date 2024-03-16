'use client';
import React from 'react';

import teams from './teams.json';
import {MyIntlProvider} from '../MyIntlProvider';
import {StaticApp} from '../components/App/StaticApp';
import {readTeams} from '../teams/readTeams';
import Logo from './logo.png';
import Image from 'next/image'

const Home: React.FC = (props) => {
    const scale = 0.038;

    return (
        <main>
            <MyIntlProvider>
                <StaticApp
                    icon={<Image src={Logo.src} height={Logo.height * scale} width={Logo.width * scale} alt={"logo"}/>}
                    teams={readTeams(teams)} {...props} />
            </MyIntlProvider>
        </main>
    );
};
export default Home;
