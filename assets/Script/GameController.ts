import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
import { mEmitter } from './Util/Event/mEmitter';
import { EventKey } from './Util/Event/EventKey';
import StateMachine from 'javascript-state-machine';

enum FSM_STATES {
    LOBBY = 'Lobby',
    ROOM = 'Room',
    BEGIN = 'Begin'
}

@ccclass('GameController')
export class GameController extends Component {

    @property(Node)
    lobby: Node | null = null;

    @property(Node)
    room: Node | null = null;

    @property(Node)
    begin: Node | null = null;

    @property(Node)
    loading: Node | null = null;

    private fsm: any = null;
    private eventHandlers: Record<string, (...args: any[]) => void> | null = null;
    private isSwitching: boolean = false;
    private currentState: FSM_STATES | null = null;

    onLoad(): void {
        this.init();
    }

    init(): void {
        this.initFSM();
        this.registerEvents();

        this.fsm.enterBegin();
    }

    initFSM(): void {
        this.fsm = new StateMachine({
            init: 'init',
            transitions: [
                { name: 'enterBegin', from: '*', to: FSM_STATES.BEGIN },
                { name: 'enterLobby', from: [FSM_STATES.BEGIN], to: FSM_STATES.LOBBY },
                { name: 'enterRoom', from: [FSM_STATES.LOBBY], to: FSM_STATES.ROOM },
                { name: 'leaveRoom', from: FSM_STATES.ROOM, to: FSM_STATES.LOBBY },
            ],
            methods: {
                onEnterBegin: () => {
                    this.switchState(FSM_STATES.BEGIN);
                },
                onEnterLobby: () => {
                    this.switchState(FSM_STATES.LOBBY);
                },
                onEnterRoom: () => {
                    this.switchState(FSM_STATES.ROOM);
                },

            }
        });
    }

    switchState(state: FSM_STATES): void {
        if (this.isSwitching) return;
        this.isSwitching = true;

        if (state === FSM_STATES.ROOM && this.room) {
            this.setActiveRecursive(this.room, true);
        }

        const prevState = this.currentState;
        this.currentState = state;
        const shouldShowLoading = prevState !== null && !(prevState === null && state === FSM_STATES.BEGIN);


        if (this.loading) {
            this.loading.active = shouldShowLoading;
            this.loading.setSiblingIndex(this.loading.parent!.children.length - 1);
        }

        this.scheduleOnce(() => {
            if (this.begin) this.begin.active = (state === FSM_STATES.BEGIN);
            if (this.lobby) this.lobby.active = (state === FSM_STATES.LOBBY);
            if (this.room) this.room.active = (state === FSM_STATES.ROOM);

            if (this.loading) this.loading.active = false;

            mEmitter.instance.emit(EventKey.GAME.STATE_CHANGED, state);

            this.isSwitching = false;

        }, shouldShowLoading ? 0.2 : 0);

        // console.log("Switch to:", state);
        // console.log("Lobby:", this.lobby);
        // console.log("Room:", this.room);
        // console.log("Begin:", this.begin);
    }

    registerEvents(): void {
        this.eventHandlers = {
            [EventKey.SCENE.LOAD_BEGIN]: this.onLoadBegin.bind(this),
            [EventKey.SCENE.LOAD_LOBBY]: this.onLoadLobby.bind(this),
            [EventKey.SCENE.LOAD_ROOM]: this.onLoadRoom.bind(this),
        };

        for (const key in this.eventHandlers) {
            mEmitter.instance.on(key, this.eventHandlers[key], this);
        }
    }

    unregisterEvents(): void {
        if (!this.eventHandlers) return;

        for (const key in this.eventHandlers) {
            mEmitter.instance.off(key, this.eventHandlers[key], this);
        }

        this.eventHandlers = null;
    }

    onLoadBegin(): void {
        if (this.fsm.is(FSM_STATES.BEGIN)) return;
        this.fsm.enterBegin();
    }

    onLoadLobby(): void {
        if (this.fsm.is(FSM_STATES.LOBBY)) return;
        this.fsm.enterLobby();
    }

    onLoadRoom(): void {
        if (this.fsm.is(FSM_STATES.ROOM)) return;
        this.fsm.enterRoom();
    }

    onDestroy(): void {
        this.unregisterEvents();
    }

    setActiveRecursive(node: Node, active: boolean) {
        node.active = active;
        node.children.forEach(child => {
            this.setActiveRecursive(child, active);
        });
    }


}

