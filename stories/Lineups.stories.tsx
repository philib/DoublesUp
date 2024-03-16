import {useState} from 'react';
import {createLineupsFor6Players} from '../app/logic/createLineups';
import {Lineup} from '../app/logic/Lineup';
import {LineupsComponent} from '../app/components/Lineups/Lineups';
import {PlayerId} from '../app/logic/RegistrationList';
import {Meta} from '@storybook/react';
import {MyIntlProvider} from '../app/MyIntlProvider';
import {VariationComponent} from "../app/components/Lineups/VariationComponent";
import {List, ListItem, ListItemText} from "@mui/material";

const meta = {
    title: 'Lineups',
    component: LineupsComponent,
    parameters: {
        // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
        layout: 'fullscreen',
    },
} satisfies Meta<typeof LineupsComponent>;

export default meta;

export const Default = () => {
    const players = [
        PlayerId.create('Player 1'),
        PlayerId.create('Player 2'),
        PlayerId.create('Player 3'),
        PlayerId.create('Player 4'),
        PlayerId.create('Player 5'),
        PlayerId.create('Player 6'),
        PlayerId.create('Player 7'),
        PlayerId.create('Player 8'),
        PlayerId.create('Player 9'),
    ];
    const [lineups, setLineups] = useState(
        createLineupsFor6Players(players) as Lineup<PlayerId>[]
    );

    return (
        <MyIntlProvider>
            <div style={{height: '100vh'}}>
                <LineupsComponent
                    lineups={lineups.map((lineup) => {
                        const activePlayers = lineup.activePlayers.map((player) => ({
                            id: player,
                        }));
                        const inactivePlayers = lineup.inactivePlayers.map((player) => ({
                            id: player,
                        }));
                        return {
                            activePlayers,
                            inactivePlayers,
                            variations: lineup.variations.map((variation) => {
                                return variation;
                            }),
                        };
                    })}
                    getPlayerNameById={(id) =>
                        Object.values(players).reduce(
                            (acc, players) => ({...acc, [players.value]: players.value}),
                            {} as { [id: string]: string }
                        )[id.value]
                    }
                />
            </div>
        </MyIntlProvider>
    );
};

export const Variation = () => {
    const getPlayerNameById: { [id: string]: string } = {}
    const player = (value: string) => {
        const id = PlayerId.create(value)
        getPlayerNameById[id.value] = value;
        return id;
    };
    return <List><ListItem>
        <VariationComponent
            variation={[[{position: 1, value: player('Max Peter WithAVeryLongLastName')}, {
                position: 2,
                value: player('Mary AlsoWithAVeryLongLastName')
            }], [{
                position: 3,
                value: player('John TheCousinOfMaxPeter')
            }, {position: 4, value: player('Some very long name')}], [{position: 5, value: player('Player 5')}, {
                position: 6,
                value: player('Player 6')
            }]]}
            getPlayerNameById={(id: PlayerId) => getPlayerNameById[id.value]}
            isFavorite={false}
            favorize={() => {
            }}
            unfavorize={() => {
            }}
        />
    </ListItem></List>
}
