import {Spieler} from "@/app/logic/model/Aufstellung";

export interface AufstellungsPaarung {
    paarungsWert: number;
    spielerSortiertNachRang: Spieler[]
}

export interface AufstellungsVariante {
    paarungen: AufstellungsPaarung[]
}
