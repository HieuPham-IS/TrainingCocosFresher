import { _decorator, Component, Node, Prefab, instantiate, director } from 'cc';
const { ccclass, property } = _decorator;
import { mEmitter } from '../../Util/Event/mEmitter';
import { EventKey } from '../../Util/Event/EventKey';
import { Player } from './Player';

@ccclass('PlayerController')
export class PlayerController extends Component {
    @property({ type: Prefab }) playerPrefab: Prefab | null = null;

    private playerNode: Node | null = null;
    private playerScript: Player | null = null;
    private playerIndex: number = 0;
    private eventHandlers: Record<string, (...args: any[]) => void> | null = null;
    private isPaused: boolean = false;

    onLoad(): void {
        this.init();
    }

    init(): void {
        this.registerEventListener();
        this.createPlayer();
    }

    createPlayer(): void {
        if (!this.playerPrefab) return;

        if (this.playerNode && this.playerNode.isValid) {
            this.playerNode.destroy();
            this.playerNode = null;
            this.playerScript = null;
        }

        this.playerNode = instantiate(this.playerPrefab);
        this.node.addChild(this.playerNode);

        this.playerScript = this.playerNode.getComponent(Player);

        this.playerIndex += 1;
        if (this.playerScript) {
            this.playerScript.node.name = `Player${this.playerIndex}`;
        }
    }

    registerEventListener(): void {
        this.eventHandlers = {
            [EventKey.INPUT.MOVE_UP]: this.onMoveUp.bind(this),
            [EventKey.INPUT.MOVE_DOWN]: this.onMoveDown.bind(this),
            [EventKey.INPUT.MOVE_UP_RELEASE]: this.onMoveUpRelease.bind(this),
            [EventKey.INPUT.MOVE_DOWN_RELEASE]: this.onMoveDownRelease.bind(this),
            [EventKey.ROOM.RESET]: this.onReset.bind(this),
            [EventKey.ROOM.GAME_OVER]: this.onGameOver.bind(this),
        };

        for (const event in this.eventHandlers) {
            mEmitter.instance.on(event, this.eventHandlers[event], this);
        }
    }

    onMoveUp(): void {
        if (!this.playerScript || director.isPaused()) return;
        if (this.playerScript.heldMoveDirection === 'up') return;
        this.playerScript.heldMoveDirection = 'up';
        if (this.playerScript.fsm.can('toMoveUp')) {
            this.playerScript.fsm.toMoveUp();
        } else {
            this.playerScript.pendingMove = 'up';
        }
    }

    onMoveDown(): void {
        if (!this.playerScript || director.isPaused()) return;
        if (this.playerScript.heldMoveDirection === 'down') return;
        this.playerScript.heldMoveDirection = 'down';
        if (this.playerScript.fsm.can('toMoveDown')) {
            this.playerScript.fsm.toMoveDown();
        } else {
            this.playerScript.pendingMove = 'down';
        }
    }

    onMoveUpRelease(): void {
        if (!this.playerScript) return;
        if (this.playerScript.heldMoveDirection === 'up') {
            this.playerScript.heldMoveDirection = null;
        }
        if (this.playerScript.pendingMove === 'up') {
            this.playerScript.pendingMove = null;
        }
        if (this.playerScript.fsm.is('moveUp')) {
            this.playerScript.fsm.toIdle();
        }
    }

    onMoveDownRelease(): void {
        if (!this.playerScript) return;
        if (this.playerScript.heldMoveDirection === 'down') {
            this.playerScript.heldMoveDirection = null;
        }
        if (this.playerScript.pendingMove === 'down') {
            this.playerScript.pendingMove = null;
        }
        if (this.playerScript.fsm.is('moveDown')) {
            this.playerScript.fsm.toIdle();
        }
    }

    onReset(): void {
        this.createPlayer();
    }

    onGameOver(): void {
        if (this.playerNode && this.playerNode.isValid) {
            this.playerNode.destroy();
            this.playerNode = null;
            this.playerScript = null;
        }
    }

    onDestroy(): void {
        if (!this.eventHandlers) return;
        for (const event in this.eventHandlers) {
            mEmitter.instance.off(event, this.eventHandlers[event], this);
        }
        this.eventHandlers = null;
    }
}