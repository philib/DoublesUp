import {Meta} from '@storybook/react';
import {NewApp} from "../app/components/App/NewApp";

const meta = {
    title: 'NewApp',
    component: NewApp,
    parameters: {
        // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
        layout: 'fullscreen',
    },
} satisfies Meta<typeof NewApp>;

export default meta;

export const Default = () => {
    return (
        <NewApp/>
    );
};
