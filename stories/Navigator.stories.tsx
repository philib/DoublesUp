import {Meta} from '@storybook/react';
import {Navigator} from '../app/components/Navigator/Navigator';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import React from 'react';
import {MyIntlProvider} from "../app/MyIntlProvider";

const meta = {
    title: 'Navigator',
    component: Navigator,
    parameters: {
        // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
        layout: 'fullscreen',
    },
} satisfies Meta<typeof Navigator>;

export default meta;

export const Default = () => {
    const CenteredDivContent: React.FunctionComponent<{
        children: React.ReactNode;
        height?: string;
    }> = ({children, height = '100vh'}) => (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height,
            }}
        >
            {children}
        </div>
    );
    const registrationList = {
        disabledHint: undefined,
        title: 'Registration List',
        icon: <AccountCircleIcon/>,
        component: <CenteredDivContent>Registration List</CenteredDivContent>,
    };

    const matchMaking = {
        disabledHint: undefined,
        title: 'Match Making',
        icon: <AccountCircleIcon/>,
        component: <CenteredDivContent>Match Making</CenteredDivContent>,
    };

    return <MyIntlProvider><Navigator navigations={[registrationList, matchMaking]}/></MyIntlProvider>;
};
