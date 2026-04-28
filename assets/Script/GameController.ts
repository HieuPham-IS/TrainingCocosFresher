import { _decorator, Component, director, game, Game, Node, sys } from 'cc';
const { ccclass, property } = _decorator;
import { mEmitter } from './Util/Event/mEmitter';
import { EventKey } from './Util/Event/EventKey';
import StateMachine from 'javascript-state-machine';

enum FSM_STATES {
    LOBBY = 'Lobby',
    ROOM = 'Room',
    EXITING = 'Exiting'
}

@ccclass('GameController')
export class GameController extends Component {
    static instance: GameController | null = null;

    @property({ visible: false })
    fsm: any = null;

    @property({ visible: false })
    isSceneLoading: boolean = false;

    @property({ visible: false })
    eventHandlers: Record<string, (...args: any[]) => void> | null = null;

    @property({ visible: false })
    singletonList: any[] = [];

    private roomInitLoad: boolean = false;
    private lobbyInitLoad: boolean = false;

    onLoad(): void {
        this.init();

    }

    init(): void {
        if (GameController.instance) {
            this.node.destroy();
            return;
        }

        GameController.instance = this;
        game.addPersistRootNode(this.node);

        this.isSceneLoading = false;

        this.initFSM();
        this.registerEvents();
        this.addSingletonToList();
    }

    initFSM(): void {
        this.fsm = new StateMachine({
            init: 'init',
            transitions: [
                { name: 'enterRoom', from: [FSM_STATES.LOBBY, 'init'], to: FSM_STATES.ROOM },
                { name: 'leaveRoom', from: [FSM_STATES.ROOM], to: FSM_STATES.LOBBY },
                { name: 'requestExit', from: [FSM_STATES.LOBBY, 'init'], to: FSM_STATES.EXITING }
            ],
            methods: {
                onEnterLobby: (lifecycle: any) => {
                    this.emitStateChange(FSM_STATES.LOBBY, lifecycle.from);

                    if (this.isSceneLoading) return;
                    this.loadSceneInternal('Lobby');
                },

                onEnterRoom: (lifecycle: any) => {
                    this.emitStateChange(FSM_STATES.ROOM, lifecycle.from);

                    if (this.isSceneLoading) return;
                    this.loadSceneInternal('Room');
                },

                onEnterExiting: () => {
                    mEmitter.instance.emit(EventKey.GAME.PREPARE_FOR_EXIT);
                    this.executeExitSteps();
                },
            }
        });
    }

    emitStateChange(newState: string, oldState: string): void {
        mEmitter.instance.emit(EventKey.GAME.STATE_CHANGED, newState, oldState);
    }

    registerEvents(): void {
        this.eventHandlers = {
            [EventKey.SCENE.LOAD_LOBBY]: this.onLoadLobby.bind(this),
            [EventKey.SCENE.LOAD_ROOM]: this.onLoadRoom.bind(this),
            [EventKey.GAME.REQUEST_EXIT]: this.onRequestExit.bind(this)

        };

        for (const event in this.eventHandlers) {
            mEmitter.instance.on(event, this.eventHandlers[event]);
        }
    }

    unregisterEvents(): void {
        if (!this.eventHandlers) return;

        for (const event in this.eventHandlers) {
            mEmitter.instance.off(event, this.eventHandlers[event]);
        }

        this.eventHandlers = null;
    }

    addSingletonToList(): void {
        this.singletonList.push(mEmitter);
    }
    cleanupSingletonList() {
        for (let i = this.singletonList.length - 1; i >= 0; i--) {
            if (this.singletonList[i]?.destroy) {
                this.singletonList[i].destroy();
            }
        }
        this.singletonList = [];
    }

    onLoadLobby(): void {
        if (this.fsm.is(FSM_STATES.LOBBY)) return;
        this.fsm.enterLobby();
    }

    onLoadRoom(): void {
        if (this.fsm.is(FSM_STATES.ROOM)) return;
        this.fsm.enterRoom();
    }

    onRequestExit(): void {
        this.fsm.requestExit();
    }

    loadSceneInternal(sceneName: string): void {
        if (this.isSceneLoading) return;

        if (director.getScene()?.name === sceneName) return;

        if (sceneName === 'Room' && !this.roomInitLoad) {
            this.roomInitLoad = true;
            return;
        }

        if (sceneName === 'Lobby' && !this.lobbyInitLoad) {
            this.lobbyInitLoad = true;
            return;
        }

        this.isSceneLoading = true;

        director.preloadScene(
            sceneName,
            (completed, total) => {
                console.log(`Preloading ${sceneName}: ${completed}/${total}`);

            },
            () => {
                director.loadScene(sceneName);
            }
        );
    }

    executeExitSteps() {
        this.cleanupSingletonList();
        this.unregisterEvents();

        director.preloadScene('Portal', () => {
            director.loadScene('Portal');

            GameController.instance = null;

            game.removePersistRootNode(this.node);
            this.node.destroy();
        });
    }


}

