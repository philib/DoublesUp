import {
    Aufstellung,
    initialeAufstellung, InvalideAufstellung, ValideAufstellung,
} from "@/app/logic/model/Aufstellung";
import {
    initiale4erMannschaftsAufstellung,
    initiale4erMixedMannschaftsAufstellung, initiale6erMannschaftsAufstellung,
    initiale6erMixedMannschaftsAufstellung
} from "@/app/logic/model/Aufstellungen";

describe('Aufstellungen', () => {
    test('6er Mixed Mannschaft validation works', () => {
        const initial = initiale6erMixedMannschaftsAufstellung([1, 2, 3, 4], [5, 6, 7, 8]);
        expect(initial.type).toEqual("InvalideAufstellung");
        const invalid = [1, 2, 3, 4, 5, 6].reduce((acc, it) => {
            const result = expectNoError(acc).spielerZurAufstellungHinzufuegen(it)
            expect(result.type).toEqual("InvalideAufstellung");
            return result;
        }, initial as Aufstellung);
        const valid = expectValid(expectNoError(invalid).spielerZurAufstellungHinzufuegen(7));
        expect(valid.type).toEqual("ValideAufstellung");
        expect(expectNoError(valid).spielerZurAufstellungHinzufuegen(8).type).toEqual("ValideAufstellung");
    });
    test('4er Mixed Mannschaft validation works', () => {
        const initial = initiale4erMixedMannschaftsAufstellung([1, 2, 3, 4], [5, 6, 7]);
        expect(initial.type).toEqual("InvalideAufstellung");
        const invalid = [1, 5, 7, 6].reduce((acc, it) => {
            const result = expectNoError(acc).spielerZurAufstellungHinzufuegen(it)
            expect(result.type).toEqual("InvalideAufstellung");
            return result;
        }, initial as Aufstellung);
        const valid = expectValid(expectNoError(invalid).spielerZurAufstellungHinzufuegen(2));
        expect(valid.type).toEqual("ValideAufstellung");
        expect(expectNoError(valid).spielerZurAufstellungHinzufuegen(4).type).toEqual("ValideAufstellung");
    });
    test('6er Mannschaft validation works', () => {
        const initial = initiale6erMannschaftsAufstellung([1, 2, 3, 4, 5, 6, 7, 8]);
        expect(initial.type).toEqual("InvalideAufstellung");
        const invalid = [8, 1, 2, 3, 4].reduce((acc, it) => {
            const result = expectNoError(acc).spielerZurAufstellungHinzufuegen(it)
            expect(result.type).toEqual("InvalideAufstellung");
            return result;
        }, initial as Aufstellung);
        const valid = expectValid(expectNoError(invalid).spielerZurAufstellungHinzufuegen(7));
        expect(valid.type).toEqual("ValideAufstellung");
    });
    test('4er Mannschaft validation works', () => {
        const initial = initiale4erMannschaftsAufstellung([1, 2, 3, 4]);
        expect(initial.type).toEqual("InvalideAufstellung");
        const invalid = [4, 1, 3].reduce((acc, it) => {
            const result = expectNoError(acc).spielerZurAufstellungHinzufuegen(it)
            expect(result.type).toEqual("InvalideAufstellung");
            return result;
        }, initial as Aufstellung);
        const valid = expectValid(expectNoError(invalid).spielerZurAufstellungHinzufuegen(2));
        expect(valid.type).toEqual("ValideAufstellung");
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
