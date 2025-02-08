import {Mixed, mixed} from "@/app/logic/AllLineupVariations";

describe('MixedLineups', () => {
    test('test', () => {
        expect(getLineupForMixedTeamOf6Players("M1", "M2", "M3", "F1", "F2", "F3")).toEqual([
            [["F1", "M1"], ["F2", "M2"], ["F3", "M3"]],// 2 4 6

            [["F1", "M1"], ["M2", "F3"], ["F2", "M3"]],// 2 5 5
            [["F1", "M1"], ["F2", "M3"], ["M2", "F3"]],// 2 5 5

            [["M1", "F2"], ["F1", "M2"], ["F3", "M3"]],// 3 3 6
            [["F1", "M2"], ["M1", "F2"], ["F3", "M3"]],// 3 3 6

            [["M1", "F2"], ["F1", "M3"], ["M2", "F3"]],// 3 4 5
            [["F1", "M2"], ["M1", "F3"], ["F2", "M3"]],// 3 4 5

            [["M1", "F3"], ["F1", "M3"], ["F2", "M2"]],// 4 4 4
            [["F1", "M3"], ["M1", "F3"], ["F2", "M2"]],// 4 4 4
        ]);
    });
});

function getLineupForMixedTeamOf6Players<Man, Woman>(manRank1: Man, manRank2: Man, manRank3: Man, womanRank1: Woman, womanRank2: Woman, womanRank3: Woman): [Man | Woman, Man | Woman][][] {
    let getPairing = <T>(transform: (m: Mixed) => T) => (pairing: Mixed[]): [T, T] => {
        let [a, b] = pairing.map(transform);
        return [a, b];
    }
    let players = [manRank1, manRank2, manRank3, womanRank1, womanRank2, womanRank3];
    const transform = getPairing((m) => players[(m.valueOf() as number) - 1])
    return mixed["6"].map((variation) => {
        return variation.map((it) => transform(it));
    });
}