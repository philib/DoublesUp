import {Mixed, mixed} from "@/app/logic/AllLineupVariations";

describe('Mixed Lineups', () => {
    test('creates correct lineup variation for a mixed team of 6 players', () => {
        expect(getLineupForMixedTeamOf6Players("M1", "M2", "M3", "F1", "F2", "F3")).toEqual([
            [{pairing: ["F1", "M1"], sum: 2}, {pairing: ["F2", "M2"], sum: 4}, {pairing: ["F3", "M3"], sum: 6}],// 2 4 6

            [{pairing: ["F1", "M1"], sum: 2}, {pairing: ["M2", "F3"], sum: 5}, {pairing: ["F2", "M3"], sum: 5}],// 2 5 5
            [{pairing: ["F1", "M1"], sum: 2}, {pairing: ["F2", "M3"], sum: 5}, {pairing: ["M2", "F3"], sum: 5}],// 2 5 5

            [{pairing: ["M1", "F2"], sum: 3}, {pairing: ["F1", "M2"], sum: 3}, {pairing: ["F3", "M3"], sum: 6}],// 3 3 6
            [{pairing: ["F1", "M2"], sum: 3}, {pairing: ["M1", "F2"], sum: 3}, {pairing: ["F3", "M3"], sum: 6}],// 3 3 6

            [{pairing: ["M1", "F2"], sum: 3}, {pairing: ["F1", "M3"], sum: 4}, {pairing: ["M2", "F3"], sum: 5}],// 3 4 5
            [{pairing: ["F1", "M2"], sum: 3}, {pairing: ["M1", "F3"], sum: 4}, {pairing: ["F2", "M3"], sum: 5}],// 3 4 5

            [{pairing: ["M1", "F3"], sum: 4}, {pairing: ["F1", "M3"], sum: 4}, {pairing: ["F2", "M2"], sum: 4}],// 4 4 4
            [{pairing: ["F1", "M3"], sum: 4}, {pairing: ["M1", "F3"], sum: 4}, {pairing: ["F2", "M2"], sum: 4}],// 4 4 4
        ]);
    });
});

function getLineupForMixedTeamOf6Players<Man, Woman>(manRank1: Man, manRank2: Man, manRank3: Man, womanRank1: Woman, womanRank2: Woman, womanRank3: Woman): {
    pairing: [Man | Woman, Man | Woman],
    sum: number
}[][] {
    let ranks = {
        [Mixed.M1]: 1,
        [Mixed.M2]: 2,
        [Mixed.M3]: 3,
        [Mixed.F1]: 1,
        [Mixed.F2]: 2,
        [Mixed.F3]: 3,
    }
    let getPairing = <T>(transform: (m: Mixed) => T) => (pairing: Mixed[]): { pairing: [T, T], sum: number } => {
        let [a, b] = pairing.map(transform);
        return {pairing: [a, b], sum: pairing.map(it => ranks[it]).reduce((a, b) => a + b)};
    }
    let players = [manRank1, manRank2, manRank3, womanRank1, womanRank2, womanRank3];
    const transform = getPairing((m) => players[(m.valueOf() as number) - 1])
    return mixed["6"].map((variation) => {
        return variation.map((it) => transform(it));
    });
}