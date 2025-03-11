import {useState} from "react";
import {MeldelisteComponent} from "./MeldelisteComponent";
import {UIMannschaft} from "@/app/components/Mannschaft";

export interface MeldelisteProps {
    mannschaft: UIMannschaft;
    onUpdate: (mannschaft: UIMannschaft) => void;
}

export const Meldeliste: React.FunctionComponent<MeldelisteProps> = ({mannschaft, onUpdate}) => {
    const updateMannschaft = (f: (_: number) => UIMannschaft) => (spieler: number) => {
        console.log(f(spieler));
       onUpdate(f(spieler));
    }
    return <MeldelisteComponent meldeListe={mannschaft.gemeldeteSpieler}
                                spielerAufstellen={(spieler) => updateMannschaft(mannschaft.aufstellen)(spieler)}
                                spielerVonAufstellungEntfernen={updateMannschaft(mannschaft.entfernen)}
                                name={mannschaft.getSpielerNameByRank}
                                istAufgestellt={mannschaft.isSpielerAufgestellt}
    />;
};