import {Meta} from "@storybook/react";
import {Mannschaft, Mannschaften, MixedMannschaft, NormalMannschaft} from "../app/components/Mannschaften/Mannschaften";

const meta = {
    title: 'Mannschaften',
    component: Mannschaften,
    parameters: {
        layout: 'fullscreen',
    },
} satisfies Meta<typeof Mannschaften>;

export default meta;

function mannschaftNormal(name: string, anzahlSpieler: 4 | 6, meldeliste: {
    [_: number]: string
}): NormalMannschaft {
    return {name, anzahlSpieler, meldeliste};
}

function mannschaftMixed(name: string, anzahlSpieler: 4 | 6, meldeliste: {
    maenner: { [_: number]: string },
    frauen: { [_: number]: string }
}): MixedMannschaft {
    return { name, anzahlSpieler, meldeliste};
}

export const Default = () => {
    const mannschaft1: NormalMannschaft =
        mannschaftNormal('Herren 30', 4, {1: "Peter", 2: "Hans", 3: "Otto", 4: "Friedrich"});
    const mannschaft2: MixedMannschaft = mannschaftMixed('Mixed 30', 4, {
        maenner: {1: "Peter", 2: "Hans", 3: "Otto", 4: "Friedrich"},
        frauen: {5: "Petra", 6: "Hannelore", 7: "Ottfriede", 8: "Frieda"}
    });

    return <Mannschaften mannschaften={[mannschaft1, mannschaft2]}/>;
}