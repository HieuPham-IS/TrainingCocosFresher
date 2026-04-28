import { _decorator, Component, Node, Vec3, instantiate, UITransform, AudioSource, PhysicsSystem2D, EPhysics2DDrawFlags } from 'cc';
const { ccclass, property } = _decorator;

import { mEmitter } from '../Util/Event/mEmitter';
import { EventKey } from '../Util/Event/EventKey';
import { gameConfig } from '../Util/GameConfig';
import { GameAsset } from '../Util/GameAsset';

@ccclass('RoomController')
export class RoomController extends Component {

    @property({ visible: false })
    private waveCurrent: number = 1;

    @property({ visible: false })
    private sumGold: number = 0;

    @property({ visible: false })
    private sumMonsterKill: number = 0;

    @property({ visible: false })
    private score: number = 0;

    @property(GameAsset)
    public gameAsset: GameAsset | null = null;

    private titleWave: Node | null = null;
    private componentTitleWave: any = null;
    private eventHandles: Record<string, (...args: any[]) => void> | null = null;

    onLoad() {
        this.initCollisionManager();
        this.registerEvent();
        this.initGame();
    }

    onDestroy() {
        this.unregisterEvent();
    }

    private initCollisionManager() {
        const physics = PhysicsSystem2D.instance;

        physics.enable = true;

        // debug (optional)
        physics.debugDrawFlags =
            EPhysics2DDrawFlags.Aabb |
            EPhysics2DDrawFlags.Pair |
            EPhysics2DDrawFlags.CenterOfMass;
    }

    private registerEvent() {
        this.eventHandles = {

            [EventKey.WAVE.WAVE_COMPLETE]: this.summaryWave.bind(this),
            [EventKey.ROOM.SUMMARY_GAME]: this.summaryGame.bind(this),
            [EventKey.ROOM.EXIT]: this.onExitRoom.bind(this),
        };

        for (const event in this.eventHandles) {
            mEmitter.instance.on(event, this.eventHandles[event], this);
        }
    }

    private unregisterEvent() {
        if (!this.eventHandles) return;
        for (const event in this.eventHandles) {
            mEmitter.instance.off(event, this.eventHandles[event], this);
        }
        this.eventHandles = null;
    }

    private initGame() {
        this.initTitleWave();
        this.scheduleGameStart();
        this.playBackgroundMusic();
    }

    private scheduleGameStart() {
        this.scheduleOnce(() => {
            this.startGame();
            this.enableTitleWave(false);
        }, gameConfig.ROOM.TIME_START_GAME);
    }

    private playBackgroundMusic() {
        // mEmitter.instance.emit(EventKey.SOUND.PLAY_BGM, AudioName.BGM.ROOM);
    }

    private initTitleWave() {
        const wavePosition = new Vec3(gameConfig.ROOM.WORD_POS.X, gameConfig.ROOM.WORD_POS.Y, 0);
        this.createTitleWave(wavePosition);
    }

    private createTitleWave(position: Vec3) {
        const prefab = this.gameAsset!.getTitleWavePrefab();
        if (!prefab) return;

        this.titleWave = instantiate(prefab);
        this.componentTitleWave = this.titleWave.getComponent('Round');

        if (this.componentTitleWave) {
            this.componentTitleWave.init(this.waveCurrent);
        }

        this.node.addChild(this.titleWave);
        this.setNodePosition(this.titleWave, position);
    }

    private enableTitleWave(enable: boolean) {
        if (this.titleWave) {
            this.titleWave.active = enable;
        }
    }

    private setNodePosition(targetNode: Node, worldPos: Vec3) {
        // Sử dụng UITransform để chuyển đổi tọa độ trong 3.x
        const uiTransform = this.node.getComponent(UITransform);
        if (uiTransform) {
            const localPos = uiTransform.convertToNodeSpaceAR(worldPos);
            targetNode.setPosition(localPos);
        }
    }

    private startGame() {
        // Đồng bộ Key với WaveController đã sửa ở lượt trước
        mEmitter.instance.emit(EventKey.WAVE.START_WAVE, this.waveCurrent);
    }

    private gameOver() {
        mEmitter.instance.emit(EventKey.ROOM.GAME_OVER);
    }

    private summaryWave() {
        if (this.isLastWave()) {
            this.handleLastWave();
            return;
        }
        this.handleNextWave();
    }

    private isLastWave(): boolean {
        return this.waveCurrent === 3;
    }

    private handleLastWave() {
        this.gameOver();
        console.log('Game Over - Reached Last Wave');
    }

    private handleNextWave() {
        console.log('Summary wave:', this.waveCurrent);
        this.updateWaveTitle();
        this.scheduleNextWave();
    }

    private updateWaveTitle() {
        if (this.componentTitleWave) {
            this.componentTitleWave.updateTitleWave(this.waveCurrent + 1);
        }
        this.enableTitleWave(true);
    }

    private scheduleNextWave() {
        this.scheduleOnce(() => {
            this.nextWave();
            this.enableTitleWave(false);
        }, gameConfig.ROOM.TIME_START_GAME);
    }

    private nextWave() {
        this.waveCurrent++;
        this.startGame();
    }

    private summaryGame(sumGold: any, sumMonsterKill: any) {
        this.updateGameStats(sumGold, sumMonsterKill);
        this.handleGameSummary();
    }

    private updateGameStats(sumGold: any, sumMonsterKill: any) {
        this.sumGold = parseInt(sumGold) || 0;
        this.sumMonsterKill = parseInt(sumMonsterKill) || 0;
        this.score = this.calculateScore();
    }

    private handleGameSummary() {
        mEmitter.instance.emit(EventKey.ROOM.UPDATE_RESULT, this.score, this.sumGold);
        // mEmitter.instance.emit(EventKey.POPUP.SHOW, PopupName.RESULT);

        // GoldController.addGold(this.sumGold);
    }

    private calculateScore(): number {
        const scoreKill = this.sumMonsterKill * gameConfig.ROOM.SUMMARY_GAME.SCORE_ONE_KILL;
        const scoreWave = this.waveCurrent * gameConfig.ROOM.SUMMARY_GAME.SCORE_ONE_WAVE;
        return scoreKill + scoreWave;
    }

    private onExitRoom() {
        this.scheduleOnce(() => {
            mEmitter.instance.emit(EventKey.SCENE.LOAD_LOBBY);
        }, 0.3);
    }
}