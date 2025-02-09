import {Regelsatz} from "@/test/Variationen.test";

export const viererMannschaft: Regelsatz = {
    type: "4erMannschaft", matrix:
        [[
            [1, 2],
            [3, 4],
        ],
            [
                [1, 3],
                [2, 4],
            ],
            [
                [1, 4],
                [2, 3],
            ],
            [
                [2, 3],
                [1, 4],
            ],
        ]
};

export const sechserMannschaft: Regelsatz = {
    type: "6erMannschaft", matrix:
        [[
            [1, 2],
            [3, 4],
            [5, 6],
        ],
            [
                [1, 2],
                [3, 5],
                [4, 6],
            ],
            [
                [1, 2],
                [3, 6],
                [4, 5],
            ],
            [
                [1, 2],
                [4, 5],
                [3, 6],
            ],
            [
                [1, 3],
                [2, 4],
                [5, 6],
            ],
            [
                [1, 3],
                [2, 5],
                [4, 6],
            ],
            [
                [1, 3],
                [2, 6],
                [4, 5],
            ],
            [
                [1, 4],
                [2, 3],
                [5, 6],
            ],
            [
                [1, 4],
                [2, 5],
                [3, 6],
            ],
            [
                [1, 4],
                [2, 6],
                [3, 5],
            ],
            [
                [1, 4],
                [3, 5],
                [2, 6],
            ],
            [
                [1, 5],
                [2, 4],
                [3, 6],
            ],
            [
                [1, 5],
                [3, 4],
                [2, 6],
            ],
            [
                [1, 6],
                [2, 5],
                [3, 4],
            ],
            [
                [1, 6],
                [3, 4],
                [2, 5],
            ],
            [
                [2, 3],
                [1, 4],
                [5, 6],
            ],
            [
                [2, 3],
                [1, 5],
                [4, 6],
            ],
            [
                [2, 3],
                [1, 6],
                [4, 5],
            ],
            [
                [2, 4],
                [1, 5],
                [3, 6],
            ],
            [
                [2, 4],
                [1, 6],
                [3, 5],
            ],
            [
                [2, 5],
                [1, 6],
                [3, 4],
            ],
            [
                [3, 4],
                [1, 6],
                [2, 5],
            ],
        ],
}

const M41 = 1;
const M42 = 2;
const F41 = 3;
const F42 = 4;

export const viererMixedMannschaft: Regelsatz = {
    type: "4erMixedMannschaft", matrix: [
        [[F41, M41], [F42, M42]],
        [[F41, M42], [M41, F42]],
    ]
}
const M61 = 1;
const M62 = 2;
const M63 = 3;
const F61 = 4;
const F62 = 5;
const F63 = 6;
export const sechserMixedMannschaft: Regelsatz = {
    type: "6erMixedMannschaft", matrix: [
        [[F61, M61], [F62, M62], [F63, M63]],// 2 4 6

        [[F61, M61], [M62, F63], [F62, M63]],// 2 5 5
        [[F61, M61], [F62, M63], [M62, F63]],// 2 5 5

        [[M61, F62], [F61, M62], [F63, M63]],// 3 3 6
        [[F61, M62], [M61, F62], [F63, M63]],// 3 3 6

        [[M61, F62], [F61, M63], [M62, F63]],// 3 4 5
        [[F61, M62], [M61, F63], [F62, M63]],// 3 4 5

        [[M61, F63], [F61, M63], [F62, M62]],// 4 4 4
        [[F61, M63], [M61, F63], [F62, M62]],// 4 4 4
    ]
}
