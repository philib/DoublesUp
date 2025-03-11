import {initialMixed, initialNormal, Mixed, Normal} from "@/app/logic/model/Aufstellung2";

type SpielerDict = { [_: number]: string };
export type MixedWithNames = Mixed & { getName: (rang: number) => string };
const mixedMitNamen = (spieler: { maenner: SpielerDict, frauen: SpielerDict }) => (mannschaftgroeße: number) => {
    return {
        ...initialMixed(
            {
                meldeliste: {
                    maenner: Object.keys(spieler.maenner).map((n) => Number.parseInt(n)),
                    frauen: Object.keys(spieler.frauen).map((n) => Number.parseInt(n))
                }
            }
        )(mannschaftgroeße),
        getName: (rang: number): string => {
            if (spieler.maenner[rang]) {
                return spieler.maenner[rang];
            } else {
                return spieler.frauen[rang];
            }
        }
    }
}

export type NormalWithNames = Normal & { getName: (rang: number) => string };
const normalMitNamen = (spieler: { [_: number]: string }) => (mannschaftgroeße: number) => {
    return {
        ...initialNormal(
            {
                meldeliste: Object.keys(spieler).map((n) => Number.parseInt(n))
            }
        )(mannschaftgroeße),
        getName: (rang: number): string => {
            return spieler[rang];
        }
    }
}