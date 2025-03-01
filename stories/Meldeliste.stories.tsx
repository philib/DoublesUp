import {Meta} from "@storybook/react";
import {Meldeliste} from "../app/components/Meldeliste/Meldeliste";
import {initialNormal} from "../app/logic/model/Aufstellung2";
import {useState} from "react";

const meta = {
    title: 'Meldeliste',
    component: Meldeliste,
    parameters: {
        layout: 'fullscreen',
    },
} satisfies Meta<typeof Meldeliste>;

export default meta;

export const Default = () => {
    const meldeliste: { [_: number]: string } = {1: "Peter", 2: "Hans", 3: "Otto", 4: "Friedrich"};
    const [initialeAufstellung, setAufstellung] = useState(initialNormal({meldeliste: Object.keys(meldeliste).map((n)=>Number.parseInt(n))}, ({aufstellung}) => aufstellung.length >= 4))
    if(initialeAufstellung.validitaet === "Valide") {
        alert("Valide")
    }
    return <Meldeliste meldeListe={initialeAufstellung.meldeliste}
                       spielerAufstellen={(spieler) => {
                           setAufstellung(initialeAufstellung.hinzufuegen(spieler))
                       }}
                       spielerVonAufstellungEntfernen={(spieler) => {
                           setAufstellung(initialeAufstellung.entfernen(spieler))
                       }}
                       name={(rang) => {
                           return meldeliste[rang]
                       }}
                       istAufgestellt={(spieler) => initialeAufstellung.aufstellung.includes(spieler)}
    />;
}