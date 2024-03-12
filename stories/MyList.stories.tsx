import {Meta} from '@storybook/react';
import {MyList, MyListItem, MyListItemDivider, MyListSubHeader} from "../app/components/List/ListComponent";
import {range} from "lodash";
import {List} from '@mui/material';
import {RoundedFrame} from "../app/components/misc/RoundedFrame";
import React from "react";

const meta = {
    title: 'List',
    parameters: {
        // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
        layout: 'fullscreen',
    },
} satisfies Meta;

export default meta;

export const Default = () => {
    return (
        <div style={{
            backgroundColor: 'blue',
        }}>
        <RoundedFrame style={{backgroundColor: 'white'}}>
            <MyList>
                {range(0, 100).map((it1) =>
                    (<MyList>
                        {<>
                            <MyListSubHeader>My Sub List {it1}</MyListSubHeader>
                            {range(0, 20).map((it) => <><MyListItem> Item {it}</MyListItem><MyListItemDivider/></>)}</>}
                    </MyList>))}
            </MyList>
        </RoundedFrame>
        </div>
    );
};
