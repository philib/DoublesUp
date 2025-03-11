import {initialMixed, initialNormal, Mixed, Normal} from "../logic/model/Aufstellung2";
import {toSpieler} from "../logic/toSpieler";

export interface UIMannschaft {
    name: string;
    gemeldeteSpieler: number[];
    spielerAnzahl: number;
    getSpielerNameByRank: (rank: number) => string;
    isSpielerAufgestellt: (rank: number) => boolean;
    aufstellen: (rank: number) => UIMannschaft;
    entfernen: (rank: number) => UIMannschaft;
    isValideAufstellung: boolean;
}

type SpielerDict = { [_: number]: string };
export const erstelleMannschaft = (
    mannschaftsName: string,
    meldeliste: SpielerDict | {
        maenner: SpielerDict,
        frauen: SpielerDict
    },
    size: 4 | 6
): UIMannschaft => {
    const stateMachine: Normal | Mixed = "maenner" in meldeliste ? initialMixed({
        meldeliste: {
            maenner: toSpieler(meldeliste.maenner),
            frauen: toSpieler(meldeliste.frauen)
        }
    })(size) : initialNormal({meldeliste: toSpieler(meldeliste)})(size)
    const getSpielerNameByRank = (rank: number) => {
        return "maenner" in meldeliste ? meldeliste.maenner[rank] || meldeliste.frauen[rank] : meldeliste[rank]
    }

    return getMannschaft(mannschaftsName, getSpielerNameByRank, size, stateMachine)
}

const getMannschaft = (name: string, getSpielerNameByRank: (rank: number) => string, spielerAnzahl: number, mannschaft: Normal | Mixed): UIMannschaft => {
    return {
        name,
        getSpielerNameByRank,
        aufstellen: (rank: number) => {
            return getMannschaft(name, getSpielerNameByRank,spielerAnzahl, mannschaft.hinzufuegen(rank))
        },
        entfernen: (rank: number) => {
            return getMannschaft(name, getSpielerNameByRank,spielerAnzahl, mannschaft.entfernen(rank))
        },
        isSpielerAufgestellt: (rank: number) => {
            return mannschaft.aufstellung.includes(rank)
        },
        isValideAufstellung: mannschaft.validitaet === "Valide",
        spielerAnzahl,
        gemeldeteSpieler: mannschaft.meldeliste
    }
}