import { _decorator, Component, Node, Vec3, instantiate, UITransform, find, Label, sys } from 'cc';
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

    @property(Label)
    private goldLabel: Label | null = null;

    @property(Label)
    private killsLabel: Label | null = null;

    @property(Label)
    private scoreLabel: Label | null = null;

    @property(GameAsset)
    public gameAsset: GameAsset | null = null;

    private titleWave: Node | null = null;
    private componentTitleWave: any = null;
    private eventHandles: Record<string, (...args: any[]) => void> | null = null;

    onLoad() {
        this.registerEvent();
        this.initGame();
    }

    onDestroy() {
        this.unregisterEvent();
    }

    private registerEvent() {
        this.eventHandles = {
            [EventKey.PLAYER.ON_DIE]: this.gameOver.bind(this),
            [EventKey.WAVE.WAVE_COMPLETE]: this.summaryWave.bind(this),
            [EventKey.ROOM.EXIT]: this.onExitRoom.bind(this),
            [EventKey.ROOM.RESET]: this.onResetGame.bind(this),
            [EventKey.MONSTER.KILLED]: this.onMonsterKilled.bind(this),
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
        this.updateStatsUI();
    }

    private scheduleGameStart() {
        this.scheduleOnce(() => {
            this.startGame();
            this.enableTitleWave(false);
        }, gameConfig.ROOM.TIME_START_GAME);
    }

    private playBackgroundMusic() {
        mEmitter.instance.emit(EventKey.SOUND.PLAY_BGM, "bgm");
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

        const canvas = find('Canvas');
        if (canvas) {
            canvas.addChild(this.titleWave);
        }

        this.titleWave.setPosition(position);
    }

    private enableTitleWave(enable: boolean) {
        if (this.titleWave) {
            this.titleWave.active = enable;
        }
    }

    private startGame() {
        mEmitter.instance.emit(EventKey.WAVE.START_WAVE, this.waveCurrent);
    }

    private gameOver() {
        let currentTotalGold = Number(sys.localStorage.getItem('totalGold') || 0);
        currentTotalGold += this.sumGold;
        sys.localStorage.setItem('totalGold', currentTotalGold.toString());

        mEmitter.instance.emit(EventKey.POPUP.SHOW, "RESULT");
        this.scheduleOnce(() => {
            mEmitter.instance.emit(EventKey.ROOM.UPDATE_RESULT, {
                score: this.score,
                gold: this.sumGold
            });
        }, 0);
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

    public onPressPause() {
        mEmitter.instance.emit(EventKey.SOUND.PLAY_SFX, "click");
        mEmitter.instance.emit(EventKey.POPUP.SHOW, "PAUSE");
    }

    private onMonsterKilled(data: { gold: number, score: number, exp: number }) {
        this.sumGold += data.gold;
        this.score += data.score;
        this.sumMonsterKill++;
        this.updateStatsUI();
        mEmitter.instance.emit(EventKey.PLAYER.ADD_EXP, data.exp);
    }

    private updateStatsUI() {
        if (this.goldLabel) this.goldLabel.string = `${this.sumGold}`;
        if (this.killsLabel) this.killsLabel.string = `${this.sumMonsterKill}`;
        if (this.scoreLabel) this.scoreLabel.string = `${this.score}`;
    }

    private onExitRoom() {
        mEmitter.instance.emit(EventKey.SCENE.LOAD_LOBBY);
    }

    private onResetGame() {
        this.unscheduleAllCallbacks();
        this.waveCurrent = 1;
        this.sumGold = 0;
        this.sumMonsterKill = 0;
        this.score = 0;
        this.updateStatsUI();

        if (this.componentTitleWave) {
            this.componentTitleWave.init(this.waveCurrent);
        }
        this.enableTitleWave(true);

        this.scheduleOnce(() => {
            this.startGame();
            this.enableTitleWave(false);
        }, gameConfig.ROOM.TIME_START_GAME);
    }

}
