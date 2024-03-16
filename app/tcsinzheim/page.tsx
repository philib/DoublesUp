'use client';
import React from 'react';

import teams from './teams.json';
import {MyIntlProvider} from '../MyIntlProvider';
import {StaticApp} from '../components/App/StaticApp';
import {readTeams} from '../teams/readTeams';
import Logo from './logo.png';
import Image from 'next/image'
import {ThemeProvider} from "@mui/material";
import {theme} from "./theme";
import {ExitPrompt} from "@/app/components/misc/ExitPrompt";

const Home: React.FC = (props) => {
    const scale = 0.038;
    return (
        <main>
            <ThemeProvider theme={theme}>
                <MyIntlProvider>
                    <ExitPrompt>
                        <StaticApp
                            icon={<Image src={Logo.src} height={Logo.height * scale} width={Logo.width * scale}
                                         alt={"logo"}/>}
                            teams={readTeams(teams)} {...props} />
                    </ExitPrompt>
                </MyIntlProvider>
            </ThemeProvider>
        </main>
    );
};
export default Home;
