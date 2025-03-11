import {Meta} from "@storybook/react";
import {Meldeliste} from "../../app/components/Meldeliste/Meldeliste";

const meta = {
    title: 'Meldeliste',
    component: Meldeliste,
    parameters: {
        layout: 'fullscreen',
    },
} satisfies Meta<typeof Meldeliste>;

export default meta;

export const Normal4 = () => {
    const meldeliste: { [_: number]: string } = {1: "Peter", 2: "Hans", 3: "Otto", 4: "Friedrich"};
    return <Meldeliste mannschaft={meldeliste}
                       size={4}
                       onValid={(aufstellung) => {
                                 alert("Valide")
                            }
                       }
    />;
}

export const Normal6 = () => {
    const meldeliste: { [_: number]: string } = {1: "Peter", 2: "Hans", 3: "Otto", 4: "Friedrich", 5: "Roman", 6: "Heinrich", 7: "Franz"};
    return <Meldeliste mannschaft={meldeliste}
                       size={6}
                       onValid={(aufstellung) => {
                           alert("Valide")
                       }}
    />;
}

export const Mixed4 = () => {
    const meldeliste = {
        maenner: {1: "Peter", 2: "Hans", 3: "Otto", 4: "Friedrich"},
        frauen: {5: "Petra", 6: "Hannelore", 7: "Ottfriede", 8: "Frieda"}
    };
    return <Meldeliste mannschaft={meldeliste}
                       size={4}
                       onValid={(aufstellung) => {
                                    alert("Valide")
                             }}
    />;
}
 export const Mixed6 = () => {
     const meldeliste = {
         maenner: {1: "Peter", 2: "Hans", 3: "Otto", 4: "Friedrich"},
         frauen: {5: "Petra", 6: "Hannelore", 7: "Ottfriede", 8: "Frieda"}
     };
     return <Meldeliste mannschaft={meldeliste}
                        size={6}
                        onValid={(aufstellung) => {
                            alert("Valide")
                        }}
     />;
 }
