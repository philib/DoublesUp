import {initialMixed, initialNormal, mixed6erRegel, normale6erRegel, Validitaet} from "@/app/logic/model/Aufstellung2";

describe('Aufstellung2', () => {
    test('state machine Mixed Aufstellung works as expected', () => {
        const initial = initialMixed({
            meldeliste: {
                maenner: [1, 2, 3, 4, 5, 6],
                frauen: [7, 8, 9, 10, 11, 12]
            }
        }, mixed6erRegel);
        expect(initial.validitaet).toEqual(Validitaet.Invalide);
        expect(initial.nichtAufgestellteSpieler).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
        const missingLastPlayer = [1, 7, 2, 8, 3].reduce((acc, spieler) => {
            const newAcc = acc.hinzufuegen(spieler)
            expect(newAcc.validitaet).toEqual(Validitaet.Invalide);
            return newAcc;
        }, initial);
        expect(missingLastPlayer.aufstellung).toEqual([1, 2, 3, 7, 8]);
        const stillInvalid = missingLastPlayer.hinzufuegen(4);
        expect(stillInvalid.validitaet).toEqual(Validitaet.Invalide);
        expect(stillInvalid.aufstellung).toEqual([1, 2, 3, 4, 7, 8]);
        const valid = stillInvalid.hinzufuegen(9);
        expect(valid.validitaet).toEqual(Validitaet.Valide);
        expect(valid.aufstellung).toEqual([1, 2, 3, 4, 7, 8, 9]);
        expect(valid.nichtAufgestellteSpieler).toEqual([5, 6, 10, 11, 12]);
        const stillValid = valid.entfernen(4);
        expect(stillValid.validitaet).toEqual(Validitaet.Valide);
        expect(stillValid.aufstellung).toEqual([1, 2, 3, 7, 8, 9]);
        const invalidAgain = stillValid.entfernen(3);
        expect(invalidAgain.validitaet).toEqual(Validitaet.Invalide);
        expect(invalidAgain.aufstellung).toEqual([1, 2, 7, 8, 9]);
    });
    test('state machine Normal Aufstellung works as expected', () => {
        const initial = initialNormal({
            meldeliste: [1, 2, 3, 4, 5, 6, 7, 8],
        }, normale6erRegel);
        expect(initial.validitaet).toEqual(Validitaet.Invalide);
        expect(initial.nichtAufgestellteSpieler).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
        const missingLastPlayer = [1, 2, 3, 4, 5].reduce((acc, spieler) => {
            const newAcc = acc.hinzufuegen(spieler)
            expect(newAcc.validitaet).toEqual(Validitaet.Invalide);
            return newAcc;
        }, initial);
        expect(missingLastPlayer.aufstellung).toEqual([1, 2, 3, 4, 5]);
        const valid = missingLastPlayer.hinzufuegen(6);
        expect(valid.validitaet).toEqual(Validitaet.Valide);
        expect(valid.aufstellung).toEqual([1, 2, 3, 4, 5, 6]);
        expect(valid.nichtAufgestellteSpieler).toEqual([7, 8]);
    });
});