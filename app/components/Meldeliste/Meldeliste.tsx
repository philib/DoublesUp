import {useState} from "react";
import {initialMixed, initialNormal, Team} from "../../logic/model/Aufstellung2";
import {MeldelisteComponent} from "./MeldelisteComponent";

interface NormaleMannschaft {
    [key: number]: string;
}

interface MixedMannschaft {
    maenner: { [_: number]: string },
    frauen: { [_: number]: string }
}

export interface MannschaftProps {
    meldeliste: NormaleMannschaft | MixedMannschaft;
    size: 4 | 6;
    onValid: (_: Team) => void;
    onInvalid: () => void;
}

export const Meldeliste: React.FunctionComponent<MannschaftProps> = ({meldeliste, size, onValid, onInvalid}) => {
    //if meldeliste is Normal, then meldeliste is of type NormaleMannschaft
    const getName = (rang: number): string => {
        if ("maenner" in meldeliste) {
            if (meldeliste.maenner[rang]) {
                return meldeliste.maenner[rang];
            } else {
                return meldeliste.frauen[rang];
            }
        } else {
            return meldeliste[rang];
        }
    }

    const createAufstellung = (size: 4 | 6) => {
        if ("maenner" in meldeliste) {
            return initialMixed({
                meldeliste: {
                    maenner: Object.keys(meldeliste.maenner).map((n) => Number.parseInt(n)),
                    frauen: Object.keys(meldeliste.frauen).map((n) => Number.parseInt(n))
                }
            })(size);
        } else {
            return initialNormal({meldeliste: Object.keys(meldeliste).map((n) => Number.parseInt(n))})(size);
        }
    }


    const [initialeAufstellung, setAufstellung] = useState(createAufstellung(size));

    initialeAufstellung.validitaet === "Valide" ? onValid(initialeAufstellung) : onInvalid();
    return <MeldelisteComponent meldeListe={initialeAufstellung.meldeliste}
                                spielerAufstellen={(spieler) => {
                           setAufstellung(initialeAufstellung.hinzufuegen(spieler))
                       }}
                                spielerVonAufstellungEntfernen={(spieler) => {
                           setAufstellung(initialeAufstellung.entfernen(spieler))
                       }}
                                name={(rang) => {
                           return getName(rang)
                       }}
                                istAufgestellt={(spieler) => initialeAufstellung.aufstellung.includes(spieler)}
    />;
};