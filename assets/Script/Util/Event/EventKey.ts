export const EventKey = {
    INPUT: {
        MOVE_UP: 'MOVE_UP',
        MOVE_DOWN: 'MOVE_DOWN',
        MOVE_LEFT: 'MOVE_LEFT',
        MOVE_RIGHT: 'MOVE_RIGHT',
        SHOOT: 'SHOOT',
    },
    PLAYER: {
        SHOOT_NORMAL: 'SHOOT_NORMAL',
    },

    MONSTER: {
        ON_HIT: 'ON_HIT',
        ON_DIE: 'ON_DIE'
    },

    SCENE: {
        LOAD_LOBBY: "LOAD_LOBBY",
        LOAD_ROOM: "LOAD_ROOM",
        LOAD_BEGIN: "LOAD_BEGIN"
    },

    GAME: {
        STATE_CHANGED: 'STATE_CHANGED'
    }
} as const;