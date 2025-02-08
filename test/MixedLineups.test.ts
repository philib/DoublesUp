import {Mixed, mixed} from "@/app/logic/AllLineupVariations";

describe('MixedLineups', () => {
    test('test', () => {
        let M1 = man("a", 1);
        let M2 = man("b", 2);
        let M3 = man("c", 3);
        let F1 = woman("d", 1);
        let F2 = woman("e", 2);
        let F3 = woman("f", 3);
        expect(generate([M1, M2, M3], [F1, F2, F3])).toEqual([
            [[M1, F1], [M2, F2], [M3, F3]],// 2 4 6

            [[M1, F1], [M2, F3], [F2, M3]],// 2 5 5
            [[M1, F1], [F2, M3], [M2, F3]],// 2 5 5

            [[M1, F2], [F1, M2], [M3, F3]],// 3 3 6
            [[F1, M2], [M1, F2], [M3, F3]],// 3 3 6

            [[M1, F2], [F1, M3], [M2, F3]],// 3 4 5
            [[F1, M2], [M1, F3], [F2, M3]],// 3 4 5

            [[M1, F3], [F1, M3], [M2, F2]],// 4 4 4
            [[M1, F3], [M2, F2], [F1, M3]],// 4 4 4
            [[F1, M3], [M1, F3], [M2, F2]],// 4 4 4
            [[F1, M3], [M2, F2], [M1, F3]],// 4 4 4
            [[M2, F2], [M1, F3], [F1, M3]],// 4 4 4
            [[M2, F2], [F1, M3], [M1, F3]],// 4 4 4
        ]);
    });
    test('test', () => {
        let M1 = man("a", 1);
        let M2 = man("b", 2);
        let M3 = man("c", 3);
        let F1 = woman("d", 1);
        let F2 = woman("e", 2);
        let F3 = woman("f", 3);
        expect(generate2(M1, M2, M3, F1, F2, F3).map((it) => it.map(a => a.sort((b, c) => b.rank - c.rank)))).toEqual([
            [[M1, F1], [M2, F2], [M3, F3]],// 2 4 6

            [[M1, F1], [M2, F3], [F2, M3]],// 2 5 5
            [[M1, F1], [F2, M3], [M2, F3]],// 2 5 5

            [[M1, F2], [F1, M2], [M3, F3]],// 3 3 6
            [[F1, M2], [M1, F2], [M3, F3]],// 3 3 6

            [[M1, F2], [F1, M3], [M2, F3]],// 3 4 5
            [[F1, M2], [M1, F3], [F2, M3]],// 3 4 5

            [[M1, F3], [F1, M3], [M2, F2]],// 4 4 4
            [[M1, F3], [M2, F2], [F1, M3]],// 4 4 4
            [[F1, M3], [M1, F3], [M2, F2]],// 4 4 4
            [[F1, M3], [M2, F2], [M1, F3]],// 4 4 4
            [[M2, F2], [M1, F3], [F1, M3]],// 4 4 4
            [[M2, F2], [F1, M3], [M1, F3]],// 4 4 4
        ]);
    });
});

function man(name: string, rank: number): Men<string> {
    return {
        type: "man",
        rank,
        t: name,
    }
}

function woman(name: string, rank: number): Woman<string> {
    return {
        type: "woman",
        rank,
        t: name,
    }
}

interface Men<T> {
    type: "man";
    rank: number;
    t: T
}

interface Woman<T> {
    type: "woman";
    rank: number;
    t: T;
}

interface Pairing<T> {
    man: Men<T>;
    woman: Woman<T>;
}

function generate2<Man, Woman>(manRank1: Man, manRank2: Man, manRank3: Man, womanRank1: Woman, womanRank2: Woman, womanRank3: Woman): [Man | Woman, Man | Woman][][] {
    let getPairing = <T>(transform: (m: Mixed) => T) => (pairing: Mixed[]): [T, T] => {
        let [a, b] = pairing.map(transform);
        return [a, b];
    }
    let players = [null as Man, manRank1, manRank2, manRank3, womanRank1, womanRank2, womanRank3];
    const transform = getPairing((m) => players[(m.valueOf() as number)])
    return mixed["6"].map((variation) => {
        return variation.sort().map((it) => transform(it.sort((a, b) => a - b)));
    });
}

function generate<T>(mens: Men<T>[], women: Woman<T>[]): [Men<T>, Woman<T>][][] {
    let all = [...mens, ...women]
    let result = mixed["6"].map((variation) => {
        return variation.map((doublesPairing) => {
            let a = doublesPairing[0].valueOf() as number;
            let b = doublesPairing[1].valueOf() as number;
            let man = (all[a - 1].type === "man" ? all[a - 1] : all[b - 1]) as Men<T>;
            let woman = (all[a - 1].type === "woman" ? all[a - 1] : all[b - 1]) as Woman<T>;
            return [man, woman].sort((a, b) => a.rank - b.rank) as [Men<T>, Woman<T>];
        });
    });
    return result;
}
