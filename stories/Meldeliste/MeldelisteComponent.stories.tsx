import {Meta} from "@storybook/react";
import {MeldelisteComponent} from "../../app/components/Meldeliste/MeldelisteComponent";
import {initialNormal} from "../../app/logic/model/Aufstellung2";
import {useState} from "react";

const meta = {
    title: 'Meldeliste',
    component: MeldelisteComponent,
    parameters: {
        layout: 'fullscreen',
    },
} satisfies Meta<typeof MeldelisteComponent>;

export default meta;

export const Component = () => {
    const meldeliste: { [_: number]: string } = {1: "Peter", 2: "Hans", 3: "Otto", 4: "Friedrich"};
    const [initialeAufstellung, setAufstellung] = useState(initialNormal({meldeliste: Object.keys(meldeliste).map((n) => Number.parseInt(n))})(4));
    if (initialeAufstellung.validitaet === "Valide") {
        alert("Valide")
    }
    return <MeldelisteComponent meldeListe={initialeAufstellung.meldeliste}
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