export const EventKey = {
    INPUT: {
        MOVE_UP: 'MOVE_UP',
        MOVE_DOWN: 'MOVE_DOWN',
        MOVE_UP_RELEASE: 'MOVE_UP_RELEASE',
        MOVE_DOWN_RELEASE: 'MOVE_DOWN_RELEASE',
        MOVE_LEFT: 'MOVE_LEFT',
        MOVE_RIGHT: 'MOVE_RIGHT',
        SHOOT: 'SHOOT',
    },
    PLAYER: {
        SHOOT_NORMAL: 'SHOOT_NORMAL',
        ON_HIT: 'ON_HIT',
        ON_DIE: 'PLAYER_ON_DIE',
        READY: 'PLAYER_READY',
        ADD_EXP: 'ADD_EXP',
    },

    MONSTER: {
        ON_HIT: 'ON_HIT',
        ON_DIE: 'ON_DIE',
        KILLED: 'MONSTER_KILLED'
    },

    SCENE: {
        LOAD_LOBBY: "LOAD_LOBBY",
        LOAD_ROOM: "LOAD_ROOM",
        LOAD_BEGIN: "LOAD_BEGIN"
    },

    GAME: {
        STATE_CHANGED: 'STATE_CHANGED',
        REQUEST_EXIT: 'REQUEST_EXIT',
        PREPARE_FOR_EXIT: 'PREPARE_FOR_EXIT',
    },

    WAVE: {
        WAVE_COMPLETE: 'WAVE_COMPLETE',
        START_WAVE: 'START_WAVE',
        ON_WAVE_READY: "ON_WAVE_READY",
    },

    ROOM: {
        START_GAME: 'START_GAME',
        GAME_OVER: 'GAME_OVER',
        SUMMARY_GAME: 'SUMMARY_GAME',
        UPDATE_RESULT: 'UPDATE_RESULT',
        EXIT: 'EXIT_ROOM',
        RESET: 'RESET_ROOM',
    },
    SOUND: {
        SET_BGM_VOLUME: 'SET_BGM_VOLUME',
        SET_SFX_VOLUME: 'SET_SFX_VOLUME',
        PLAY_SFX: 'PLAY_SFX',
        ENABLE_BGM: 'ENABLE_BGM',
        PLAY_BGM: 'PLAY_BGM',
        STOP_BGM: 'STOP_BGM',

    },
    POPUP: {
        SHOW: 'showPopup',
        HIDE: "hidePopup"
    },
} as const;