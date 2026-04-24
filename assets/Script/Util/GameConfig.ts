export const gameConfig = {
    MONSTER: {
        TYPE: {
            DRAGON: {
                NAME: "DRAGON",
                HP: 1000
            },

            WOLF: {
                NAME: "WOLF",
                HP: 100
            }
        }
    },

    BULLET: {
        TYPE: {
            NORMAL: {
                NAME: "NORMAL",
                DAMAGE: 10,
                SPEED: 1000,
                DURATION_MOVE: 1.2
            }
        }
    }
} as const;