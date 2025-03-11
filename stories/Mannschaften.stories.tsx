import {Meta} from "@storybook/react";
import {Mannschaften} from "../app/components/Mannschaften/Mannschaften";
import {erstelleMannschaft} from "../app/components/UIMannschaft";

const meta = {
    title: 'Mannschaften',
    component: Mannschaften,
    parameters: {
        layout: 'fullscreen',
    },
} satisfies Meta<typeof Mannschaften>;

export default meta;

export const Default = () => {
    const mannschaft1 =
        erstelleMannschaft('Herren 30', {1: "Peter", 2: "Hans", 3: "Otto", 4: "Friedrich"}, 4);
    const mannschaft2 = erstelleMannschaft('Mixed 30', {
        maenner: {1: "Peter", 2: "Hans", 3: "Otto", 4: "Friedrich"},
        frauen: {5: "Petra", 6: "Hannelore", 7: "Ottfriede", 8: "Frieda"}
    }, 4);

    return <Mannschaften mannschaften={[mannschaft1, mannschaft2]}/>;
}