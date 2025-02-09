import {Aufstellung, InvalideAufstellung, Spieler, ValideAufstellung} from "@/app/logic/model/Aufstellung";
import {AufstellungsVariante} from "@/app/logic/model/AufstellungsVarianten";
import {initiale4erMannschaftsAufstellung, initiale4erMixedMannschaftsAufstellung} from "@/app/logic/model/Meldungen";
import {viererMannschaft, viererMixedMannschaft} from "@/app/logic/model/Regelsatz";
import {getPermutations} from "@/app/logic/getPermutations";

describe('Variationen', () => {
    test('berechne simple variation', () => {
        const valideAufstellung = stelleAlleSpielerAuf(initiale4erMannschaftsAufstellung([1, 2, 3, 4]));
        expect(valideAufstellung.type).toEqual("ValideAufstellung");
        const variationen = berechneVariationen(valideAufstellung.aufgestellteSpieler, viererMannschaft);
        expect(variationen).toEqual([
                {
                    paarungen: [
                        {paarungsWert: 3, spielerSortiertNachRang: [1, 2]},
                        {paarungsWert: 7, spielerSortiertNachRang: [3, 4]},
                    ]
                },
                {
                    paarungen: [
                        {paarungsWert: 4, spielerSortiertNachRang: [1, 3]},
                        {paarungsWert: 6, spielerSortiertNachRang: [2, 4]},
                    ]
                },
                {
                    paarungen: [
                        {paarungsWert: 5, spielerSortiertNachRang: [1, 4]},
                        {paarungsWert: 5, spielerSortiertNachRang: [2, 3]},
                    ]
                },
                {
                    paarungen: [
                        {paarungsWert: 5, spielerSortiertNachRang: [2, 3]},
                        {paarungsWert: 5, spielerSortiertNachRang: [1, 4]},

                    ]
                }
            ],
        );

    });
    test('berechne simple mixed variation', () => {
        const valideAufstellung = stelleAlleSpielerAuf(initiale4erMixedMannschaftsAufstellung([1, 2], [3, 4]));
        expect(valideAufstellung.type).toEqual("ValideAufstellung");
        const variationen = berechneAlleVariationen(valideAufstellung, viererMixedMannschaft);
        expect(variationen).toEqual([
            [{
                paarungen: [
                    {paarungsWert: 4, spielerSortiertNachRang: [3, 1]},
                    {paarungsWert: 6, spielerSortiertNachRang: [4, 2]},
                ]
            },
                {
                    paarungen: [
                        {paarungsWert: 5, spielerSortiertNachRang: [3, 2]},
                        {paarungsWert: 5, spielerSortiertNachRang: [1, 4]},
                    ]
                },
            ],
        ]);
    });

    test('berechne komplexe mixed variation', () => {
        const valideAufstellung = stelleAlleSpielerAuf(initiale4erMixedMannschaftsAufstellung([1, 2, 3], [4, 5]));
        expect(valideAufstellung.type).toEqual("ValideAufstellung");
        const variationen = berechneAlleVariationen(valideAufstellung, viererMixedMannschaft);
        expect(variationen).toEqual([
            // ohne 3
            [{
                paarungen: [
                    {paarungsWert: 4, spielerSortiertNachRang: [4, 1]},
                    {paarungsWert: 6, spielerSortiertNachRang: [5, 2]},
                ]
            },
                {
                    paarungen: [
                        {paarungsWert: 5, spielerSortiertNachRang: [4, 2]},
                        {paarungsWert: 5, spielerSortiertNachRang: [1, 5]},
                    ]
                },
            ],
            // 3 statt 2
            [{
                paarungen: [
                    {paarungsWert: 4, spielerSortiertNachRang: [4, 1]},
                    {paarungsWert: 6, spielerSortiertNachRang: [5, 3]},
                ]
            },
                {
                    paarungen: [
                        {paarungsWert: 5, spielerSortiertNachRang: [4, 3]},
                        {paarungsWert: 5, spielerSortiertNachRang: [1, 5]},
                    ]
                },
            ],
            // 3 statt 2 und 2 statt 1
            [{
                paarungen: [
                    {paarungsWert: 4, spielerSortiertNachRang: [4, 2]},
                    {paarungsWert: 6, spielerSortiertNachRang: [5, 3]},
                ]
            },
                {
                    paarungen: [
                        {paarungsWert: 5, spielerSortiertNachRang: [4, 3]},
                        {paarungsWert: 5, spielerSortiertNachRang: [2, 5]},
                    ]
                },
            ],

        ]);
    });
});

export type Regelsatz =
    { type: "4erMannschaft", matrix: number[][][] } |
    { type: "6erMannschaft", matrix: number[][][] } |
    { type: "4erMixedMannschaft", matrix: number[][][] } |
    { type: "6erMixedMannschaft", matrix: number[][][] };


type ValideSpielerAufstellung = Spieler[]

function berechneAlleVariationen(valideAufstellung: ValideAufstellung, regelSatz: Regelsatz): AufstellungsVariante[][] {
    if (regelSatz.type === "4erMannschaft") {
        return berechnePermutationen(valideAufstellung, 4).map(valideSpielerAufstellung => berechneVariationen(valideSpielerAufstellung, regelSatz));
    } else if (regelSatz.type === "6erMannschaft") {
        return berechnePermutationen(valideAufstellung, 6).map(valideSpielerAufstellung => berechneVariationen(valideSpielerAufstellung, regelSatz));
    } else if (regelSatz.type === "4erMixedMannschaft") {
        return berechnePermutationen(valideAufstellung, 4).map(valideSpielerAufstellung => berechneVariationen(valideSpielerAufstellung, regelSatz));
    } else {
        throw new Error("Unknown Regelsatz");
    }
}

function berechnePermutationen(valideAufstellung: ValideAufstellung, minimaleSpielerAnzahl: number): ValideSpielerAufstellung[] {
    return getPermutations(valideAufstellung.aufgestellteSpieler, minimaleSpielerAnzahl);
}

function berechneVariationen(valideSpielerAufstellung: ValideSpielerAufstellung, regelSatz: Regelsatz): AufstellungsVariante[] {
    return regelSatz.matrix.map(variation => {
        return ({
            paarungen: variation.flatMap(paarung => {
                return ({
                    paarungsWert: paarung[0] + paarung[1],
                    spielerSortiertNachRang: [paarung[0], paarung[1]].map(rang => valideSpielerAufstellung[rang - 1])
                })
            })
        });
    });
}

function stelleAlleSpielerAuf(initialeAufstellung: InvalideAufstellung): ValideAufstellung {
    const result = initialeAufstellung.nichtAufgestellteSpieler.reduce((acc, it) => {
        if (acc.type === "Fehler") {
            throw new Error("Error");
        }
        return acc.spielerZurAufstellungHinzufuegen(it);
    }, initialeAufstellung as Aufstellung);
    if (result.type === "Fehler" || result.type === "InvalideAufstellung") {
        throw new Error("Error");
    }
    return result;
}