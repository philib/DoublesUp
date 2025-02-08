export const allLineupVariations = {
    4: [
        [
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
    ],
    6: [
        [
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
} as const;

export enum Mixed {
    M1 = 1,
    M2=2,
    M3=3,
    F1=4,
    F2=5,
    F3=6,
}

export const mixed = {
    6: [
        [[Mixed.M1, Mixed.F1], [Mixed.M2, Mixed.F2], [Mixed.M3, Mixed.F3]],// 2 4 6

        [[Mixed.M1, Mixed.F1], [Mixed.M2, Mixed.F3], [Mixed.F2, Mixed.M3]],// 2 5 5
        [[Mixed.M1, Mixed.F1], [Mixed.F2, Mixed.M3], [Mixed.M2, Mixed.F3]],// 2 5 5

        [[Mixed.M1, Mixed.F2], [Mixed.F1, Mixed.M2], [Mixed.M3, Mixed.F3]],// 3 3 6
        [[Mixed.F1, Mixed.M2], [Mixed.M1, Mixed.F2], [Mixed.M3, Mixed.F3]],// 3 3 6

        [[Mixed.M1, Mixed.F2], [Mixed.F1, Mixed.M3], [Mixed.M2, Mixed.F3]],// 3 4 5
        [[Mixed.F1, Mixed.M2], [Mixed.M1, Mixed.F3], [Mixed.F2, Mixed.M3]],// 3 4 5

        [[Mixed.M1, Mixed.F3], [Mixed.F1, Mixed.M3], [Mixed.F2, Mixed.M2]],// 4 4 4
        [[Mixed.M1, Mixed.F3], [Mixed.F2, Mixed.M2], [Mixed.F1, Mixed.M3]],// 4 4 4
        [[Mixed.F1, Mixed.M3], [Mixed.M1, Mixed.F3], [Mixed.F2, Mixed.M2]],// 4 4 4
        [[Mixed.F1, Mixed.M3], [Mixed.F2, Mixed.M2], [Mixed.M1, Mixed.F3]],// 4 4 4
        [[Mixed.M2, Mixed.F2], [Mixed.M1, Mixed.F3], [Mixed.F1, Mixed.M3]],// 4 4 4
        [[Mixed.M2, Mixed.F2], [Mixed.F1, Mixed.M3], [Mixed.M1, Mixed.F3]],// 4 4 4
    ],
}
