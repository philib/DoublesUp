import {
    Aufstellung,
    initialeAufstellung,
    InvalideAufstellung,
    ValideAufstellung
} from "@/app/logic/model/Aufstellung";

describe('Aufstellung', () => {
    test('state machine Aufstellung works as expected', () => {
        const statischeVariante = [{
            paarungen: [{
                spielerSortiertNachRang: [1, 2],
                paarungsWert: 3
            }]
        }];
        let initial = initialeAufstellung([1, 2, 3], (a) => a.length >= 2, (a) => statischeVariante);
        expect(initial.type).toEqual("InvalideAufstellung");
        expect(initial.nichtAufgestellteSpieler).toEqual([1, 2, 3]);
        expect(initial.aufgestellteSpieler).toEqual([]);
        let onePlayerMissing = initial.spielerZurAufstellungHinzufuegen(2);
        expect(onePlayerMissing.type).toEqual("InvalideAufstellung");
        let validAufstellung = expectNoError(onePlayerMissing).spielerZurAufstellungHinzufuegen(1);
        expect(initial.type).toEqual("InvalideAufstellung");
        expect(onePlayerMissing.type).toEqual("InvalideAufstellung");
        expect(validAufstellung.type).toEqual("ValideAufstellung");

        let cannotAddUnknownPlayer = expectNoError(onePlayerMissing).spielerZurAufstellungHinzufuegen(99);
        expect(cannotAddUnknownPlayer.type).toEqual("Fehler");

        let cannotRemoveUnknownPlayer = expectNoError(validAufstellung).spielerVonDerAufstellungEntfernen(99);
        expect(cannotRemoveUnknownPlayer.type).toEqual("Fehler");

        let addingSamePlayerTwice = expectNoError(validAufstellung).spielerZurAufstellungHinzufuegen(1);
        expect(addingSamePlayerTwice.type).toEqual("ValideAufstellung");
        expect(expectNoError(addingSamePlayerTwice).aufgestellteSpieler).toEqual([1, 2]);
        expect(expectNoError(addingSamePlayerTwice).nichtAufgestellteSpieler).toEqual([3]);
        expect(expectValid(addingSamePlayerTwice).varianten).toEqual(statischeVariante);

        let removingPlayer = expectNoError(validAufstellung).spielerVonDerAufstellungEntfernen(2);
        expect(removingPlayer.type).toEqual("InvalideAufstellung");
        expect(expectNoError(removingPlayer).aufgestellteSpieler).toEqual([1]);
        expect(expectNoError(removingPlayer).nichtAufgestellteSpieler).toEqual([2, 3]);

        let removingSamePlayerTwice = expectNoError(removingPlayer).spielerVonDerAufstellungEntfernen(2);
        expect(removingSamePlayerTwice.type).toEqual("InvalideAufstellung");
        expect(expectNoError(removingSamePlayerTwice).aufgestellteSpieler).toEqual([1]);
        expect(expectNoError(removingSamePlayerTwice).nichtAufgestellteSpieler).toEqual([2, 3]);
    });
});

function expectNoError(aufstellung: Aufstellung): ValideAufstellung | InvalideAufstellung {
    if (aufstellung.type === "Fehler") {
        throw new Error("Invalide Aufstellung");
    } else {
        return aufstellung;
    }
}

function expectValid(aufstellung: Aufstellung): ValideAufstellung {
    if (aufstellung.type !== "ValideAufstellung") {
        throw new Error("Invalide Aufstellung");
    } else {
        return aufstellung;
    }
}
