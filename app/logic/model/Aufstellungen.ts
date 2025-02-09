import {initialeAufstellung, InvalideAufstellung, Spieler} from "@/app/logic/model/Aufstellung";

export function initiale6erMannschaftsAufstellung(meldeListe: Spieler[]): InvalideAufstellung {
    return initialeAufstellung(meldeListe, (spieler) => spieler.length >= 6);
}

export function initiale4erMannschaftsAufstellung(meldeListe: Spieler[]): InvalideAufstellung {
    return initialeAufstellung(meldeListe, (spieler) => spieler.length >= 4);
}

export function initiale6erMixedMannschaftsAufstellung(maenner: Spieler[], frauen: Spieler[]): InvalideAufstellung {
    return initialeAufstellung([...maenner, ...frauen], (spieler) => {
        return maenner.filter(it => spieler.includes(it)).length >= 3 && frauen.filter(it => spieler.includes(it)).length >= 3;
    });
}

export function initiale4erMixedMannschaftsAufstellung(maenner: Spieler[], frauen: Spieler[]): InvalideAufstellung {
    return initialeAufstellung([...maenner, ...frauen], (spieler) => {
        return maenner.filter(it => spieler.includes(it)).length >= 2 && frauen.filter(it => spieler.includes(it)).length >= 2;
    });
}
