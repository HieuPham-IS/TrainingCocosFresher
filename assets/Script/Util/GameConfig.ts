export const gameConfig = {
    PLAYER: {
        HP_BASE: 150,
        POSITION: {

            INIT: {
                X: -450,
                Y: -100,
            }

        }
    },
    MONSTER: {
        INIT_LOCATION: {
            X: 1560,
            Y: [100, 250, 400, 550],
        },
        PASS_POSITION_X: -350,
        WAVE_COUNT: 10,
        HP_BASE: 100,
        DAMAGE_BASE: 25,

        TYPE: {
            BOSS: {
                NAME: "BOSS",
                COEFFICIENT_HP: 10,
                COEFFICIENT_DAMAGE: 4,
                DURATION_MOVE: 2,
                GOLD: 1000,
                SCORE: 100,
                EXP: 50,
            },

            WOLF: {
                NAME: "WOLF",
                COEFFICIENT_HP: 1,
                COEFFICIENT_DAMAGE: 1,
                DURATION_MOVE: 0.5,
                GOLD: 100,
                SCORE: 10,
                EXP: 10,
            },
            DOG: {
                NAME: "DOG",
                COEFFICIENT_HP: 2,
                COEFFICIENT_DAMAGE: 1.5,
                DURATION_MOVE: 0.7,
                GOLD: 200,
                SCORE: 20,
                EXP: 20,
            },
        }
    },

    BULLET: {
        TYPE: {
            NORMAL: {
                NAME: "NORMAL",
                DAMAGE: 50,
                SPEED: 1000,
                DURATION_MOVE: 1.2
            }
        }
    },
    ROOM: {
        TIME_START_GAME: 4,
        TIME_NEXT_WAVE: 3,
        WORD_POS: {
            X: 0,
            Y: 0,
        },
        SUMMARY_GAME: {
            SCORE_ONE_KILL: 10,
            SCORE_ONE_WAVE: 50,
        }
    }
} as const;