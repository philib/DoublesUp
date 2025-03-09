import {Spieler} from "@/app/logic/model/Aufstellung";

export const toSpieler = (m: { [_: number]: string }): Spieler[] => Object.keys(m).map((n) => Number.parseInt(n));