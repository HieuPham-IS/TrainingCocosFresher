import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
import { gameConfig } from '../../Util/GameConfig';
import { mEmitter } from '../../Util/Event/mEmitter';
import { EventKey } from '../../Util/Event/EventKey';
import { WaveCalculator } from './WaveCalculator';

type MonsterTypeCounts = {
    [key: string]: number;
};


@ccclass('WaveController')
export class WaveController extends Component {
    @property({ visible: false })
    currentLevel: number = 1;

    @property({ visible: false })
    totalMonstersThisWave: number = 0;

    @property({ visible: false })
    monsterTypeCounts: MonsterTypeCounts = {};

    @property({
        tooltip: "Time between monster spawns in seconds"
    })
    spawnInterval: number = 1.5;

    private eventMap: Map<string, (...args: any[]) => void> | null = null;

    onLoad(): void {
        this.registerEvent();
    }

    onDestroy(): void {
        this.unregisterEvent();
    }

    startWave(): void {
        this.totalMonstersThisWave =
            WaveCalculator.calculateMonsterCountForLevel(this.currentLevel);

        this.monsterTypeCounts =
            WaveCalculator.calculateMonsterTypeCounts(
                this.currentLevel,
                this.totalMonstersThisWave
            );

        mEmitter.instance.emit(EventKey.WAVE.ON_WAVE_READY, {
            level: this.currentLevel,
            totalMonsters: this.totalMonstersThisWave,
            monsterTypeCounts: this.monsterTypeCounts,
            spawnInterval: this.spawnInterval
        });
    }

    onNextWave(): void {
        this.currentLevel++;
        this.startWave();
    }

    startSpecificWave(level: number): void {
        this.currentLevel = level;
        this.startWave();
    }

    onReset(): void {
        this.currentLevel = 1;
    }

    registerEvent(): void {
        this.eventMap = new Map<string, (...args: any[]) => void>([
            [EventKey.WAVE.START_WAVE, this.startSpecificWave.bind(this)],
            [EventKey.ROOM.RESET, this.onReset.bind(this)]
        ]);

        this.eventMap.forEach((handler, key) => {
            mEmitter.instance.on(key, handler);
        });
    }

    unregisterEvent(): void {
        if (!this.eventMap) return;

        this.eventMap.forEach((handler, key) => {
            mEmitter.instance.off(key, handler);
        });

        this.eventMap.clear();
    }
}


