import { _decorator, Component, Node, Prefab, instantiate } from 'cc';
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
            [EventKey.ROOM.RESET]: this.onReset.bind(this),
        };

        for (const event in this.eventHandlers) {
            mEmitter.instance.on(event, this.eventHandlers[event], this);
        }
    }

    onMoveUp(): void {
        if (!this.playerScript?.fsm.can('toMoveUp')) return;
        this.playerScript.fsm.toMoveUp();
    }

    onMoveDown(): void {
        if (!this.playerScript?.fsm.can('toMoveDown')) return;
        this.playerScript.fsm.toMoveDown();
    }

    onReset(): void {
        this.createPlayer();
    }

    onDestroy(): void {
        if (!this.eventHandlers) return;
        for (const event in this.eventHandlers) {
            mEmitter.instance.off(event, this.eventHandlers[event], this);
        }
        this.eventHandlers = null;
    }
}