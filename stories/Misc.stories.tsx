import {Meta} from '@storybook/react';
import React from "react";
import {RoundedFrame} from "./../app/components/misc/RoundedFrame";

const meta = {
    title: 'Misc',
    parameters: {
        // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
        layout: 'fullscreen',
    },
} satisfies Meta;

export default meta;

export const RoundedFrameSmallContent = () => {
    return (
        <div style={{backgroundColor: 'blue', width: '150px', height: '350px'}}>
            <RoundedFrame>
                <div style={{backgroundColor: 'red'}}>Some content</div>
            </RoundedFrame>
        </div>
    );
};

export const RoundedFrameScrollContent = () => {
    return (
        <div style={{backgroundColor: 'blue', width: '150px', height: '350px'}}>
            <RoundedFrame>
                <div style={{backgroundColor: 'red', height:'600px'}}>Some content</div>
            </RoundedFrame>
        </div>
    );
};
