
import { _decorator, Component, Prefab, instantiate, Vec3, PhysicsSystem2D, log, EPhysics2DDrawFlags } from 'cc';
const { ccclass, property } = _decorator;
import { mEmitter } from '../../Util/Event/mEmitter';
import { gameConfig } from '../../Util/GameConfig'
import { EventKey } from './../../Util/Event/EventKey';
import { MonsterItem } from './MonsterItem';
import { GameAsset } from '../../Util/GameAsset';

@ccclass('MonsterManager')
export class MonsterManager extends Component {

    @property(Prefab)
    prefabMonster: Prefab | null = null;

    @property({ visible: false })
    listChar: MonsterItem[] = [];

    @property({ visible: false })
    isWinLevel: boolean = true;

    @property({ visible: false })
    isGameOver: boolean = false;

    @property({ visible: false })
    spawnedCount: number = 0;

    @property({ visible: false })
    currentWaveData: any = null;

    @property(GameAsset)
    gameAsset: GameAsset | null = null;

    @property({ visible: false })
    sumMonsterKill: number = 0;

    private totalMonsters: number = 0;
    private eventHandles: Record<string, (...args: any[]) => void> | null = null;

    private recentlyUsedLanes: number[] = [];
    private readonly LANE_COOLDOWN = 2;

    onLoad() {
        PhysicsSystem2D.instance.enable = true;
        // PhysicsSystem2D.instance.debugDrawFlags =
        //     EPhysics2DDrawFlags.Aabb |
        //     EPhysics2DDrawFlags.Pair |
        //     EPhysics2DDrawFlags.CenterOfMass |
        //     EPhysics2DDrawFlags.Joint |
        //     EPhysics2DDrawFlags.Shape;


        console.log('MonsterManager loaded');
        this.clearEditorMonsters();
        this.registerEvent();
    }

    onDestroy() {
        this.unregisterEvent();
    }

    onStartWave(data: any) {
        // console.log('START WAVE', data);
        this.unscheduleAllCallbacks();
        this.resetWaveState(data);
        this.spawnNextMonster(data);
    }

    resetWaveState(data: any) {
        this.spawnedCount = 0;
        this.currentWaveData = data;
        this.totalMonsters = data.totalMonsters;
        this.recentlyUsedLanes = []
    }

    spawnNextMonster(waveData: any) {
        // console.log('SPAWN', this.spawnedCount);
        if (this.shouldStopSpawning(waveData)) return;

        const monsterType = this.selectMonsterTypeForSpawn(waveData);
        this.spawnMonster(monsterType, waveData.level);

        this.incrementSpawnCount();
        this.scheduleNextSpawn(waveData);
    }

    shouldStopSpawning(waveData: any) {
        return this.spawnedCount >= waveData.totalMonsters;
    }

    incrementSpawnCount() {
        this.spawnedCount++;
    }

    scheduleNextSpawn(waveData: any) {
        if (this.spawnedCount < waveData.totalMonsters && !this.isGameOver) {

            const randomDelay = waveData.spawnInterval * (0.8 + Math.random() * 0.4);

            this.scheduleOnce(() => {
                this.spawnNextMonster(waveData);
            }, randomDelay);
        }
    }

    selectMonsterTypeForSpawn(waveData: any) {
        if (this.shouldSpawnBoss(waveData)) {
            return gameConfig.MONSTER.TYPE.BOSS;
        }
        return this.selectRandomMonsterType(waveData);
    }

    selectRandomMonsterType(waveData: any) {
        const monsterTypes = Object.keys(waveData.monsterTypeCounts);
        const randomIndex = Math.floor(Math.random() * monsterTypes.length);
        const selectedType = monsterTypes[randomIndex];

        waveData.monsterTypeCounts[selectedType]--;

        return gameConfig.MONSTER.TYPE[selectedType];
    }

    shouldSpawnBoss(waveData: any) {
        const level = waveData.level;
        return level % 2 === 0 && this.spawnedCount === waveData.totalMonsters - 5;
    }

    spawnMonster(type: any, level: number) {
        const monsterConfig = this.createMonsterConfig(type, level);
        // console.log(`Spawn Monster at World Pos: ${monsterConfig.position}`);
        const monster = this.instantiateMonster(monsterConfig);
        this.setupMonster(monster, monsterConfig);
    }

    createMonsterConfig(type: any, level: number) {
        const baseStats = this.calculateBaseStats(level);

        const config = {
            id: this.generateMonsterId(),
            type,
            position: this.genInitPosition(),
            hp: baseStats.hp * type.COEFFICIENT_HP,
            maxHp: baseStats.hp * type.COEFFICIENT_HP,
            damage: baseStats.damage * type.COEFFICIENT_DAMAGE,
            durationMove: this.calculateMoveDuration(type, level),
            level,
            spriteFrame: this.getSpriteFrameByType(type.NAME)
        };

        // console.log("Monster Config:", config);

        return config;
    }

    instantiateMonster(config: any) {
        const monster = instantiate(this.prefabMonster!);
        const monsterItem = monster.getComponent(MonsterItem)!;
        monsterItem.init(config);

        return { monster, monsterItem };
    }

    setupMonster(monsterData: any, config: any) {
        const { monster, monsterItem } = monsterData;

        this.addMonsterToScene(monster, config.position);
        this.addMonsterToList(monsterItem);
    }

    addMonsterToScene(monster: any, position: any) {
        this.node.addChild(monster);
        this.setMonsterPosition(monster, position);
    }

    addMonsterToList(monsterItem: MonsterItem) {
        this.listChar.push(monsterItem);
        monsterItem.onMove();
    }

    setMonsterPosition(monster: any, worldPos: any) {
        // const localPos = this.node.inverseTransformPoint(new Vec3(), worldPos);
        // monster.setPosition(localPos);

        const localPos = new Vec3();
        this.node.inverseTransformPoint(localPos, worldPos);
        monster.setPosition(localPos);
        // console.log('world in:', worldPos, '→ local set:', localPos, '→ world after:', monster.worldPosition);
    }

    calculateBaseStats(level: number) {
        const levelMultiplier = 1 + (level - 1) * 0.15 + Math.pow(level - 1, 1.2) * 0.02;

        return {
            hp: gameConfig.MONSTER.HP_BASE * levelMultiplier,
            damage: gameConfig.MONSTER.DAMAGE_BASE * levelMultiplier,

        };
    }

    calculateMoveDuration(type: any, level: number) {
        const speedBonus = Math.min(2, level * 0.05);
        return Math.max(3, type.DURATION_MOVE - speedBonus);
    }

    generateMonsterId() {
        return Date.now() + Math.random();
    }

    genInitPosition() {
        const lanes = gameConfig.MONSTER.INIT_LOCATION.Y;
        const usedSet = new Set(this.recentlyUsedLanes);
        const availableLanes = lanes.filter(lane => !usedSet.has(lane));
        const lanePool = availableLanes.length > 0 ? availableLanes : [lanes[0]];
        const selectedLane = lanePool[Math.floor(Math.random() * lanePool.length)];

        this.recentlyUsedLanes.push(selectedLane);
        if (this.recentlyUsedLanes.length > this.LANE_COOLDOWN) {
            this.recentlyUsedLanes.shift();
        }

        const y = selectedLane + (Math.random() * 30 - 15);
        return new Vec3(gameConfig.MONSTER.INIT_LOCATION.X, y, 0);
    }

    getSpriteFrameByType(type: string) {
        return this.gameAsset!.getSpriteByType(type);
    }

    onMonsterDie(monster: MonsterItem) {
        this.removeMonsterFromList(monster);
        this.checkWaveCompletion();
    }

    removeMonsterFromList(monster: MonsterItem) {
        monster.onDie();

        const index = this.listChar.indexOf(monster);
        if (index !== -1) {
            this.listChar.splice(index, 1);
        }
    }

    checkWaveCompletion() {
        if (this.listChar.length === 0 && !this.isGameOver && this.totalMonsters === this.spawnedCount) {
            mEmitter.instance.emit(EventKey.WAVE.WAVE_COMPLETE);
        }
    }

    takeDamage(monster: any, bullet: any) {
        if (!monster || monster.hp <= 0) return;
        this.applyDamage(monster, bullet);
        monster.updateHP();
        this.handleMonsterDeath(monster);
    }

    applyDamage(monster: any, bullet: any) {
        monster.hp -= bullet.damage;
    }

    handleMonsterDeath(monster: any) {
        if (monster.hp <= 0) {
            this.updateGameStats(monster);
        }
    }

    updateGameStats(monster: any) {
        this.sumMonsterKill++;
    }

    registerEvent() {
        this.eventHandles = {
            [EventKey.WAVE.ON_WAVE_READY]: this.onStartWave.bind(this),
            [EventKey.MONSTER.ON_HIT]: this.onMonsterHit.bind(this),
            [EventKey.MONSTER.ON_DIE]: this.onMonsterDie.bind(this),
            [EventKey.ROOM.GAME_OVER]: this.onGameOver.bind(this),
            [EventKey.ROOM.RESET]: this.onReset.bind(this),
        };
        for (const event in this.eventHandles) {
            mEmitter.instance.on(event, this.eventHandles[event], this);
        }
    }

    unregisterEvent() {
        if (!this.eventHandles) return;

        for (const event in this.eventHandles) {
            mEmitter.instance.off(event, this.eventHandles[event], this);
        }

        this.eventHandles = null;
    }

    onGameOver() {
        this.setGameOverState();
        this.clearMonsters();
        this.emitGameSummary();
    }

    setGameOverState() {
        this.isGameOver = true;
    }

    clearMonsters() {
        this.listChar.forEach((monster) => {
            monster.onDie();
        });
        this.listChar = [];
    }

    emitGameSummary() {
        mEmitter.instance.emit(
            EventKey.ROOM.SUMMARY_GAME,
            this.sumMonsterKill
        );
    }

    onMonsterHit(monster: any, bullet: any) {
        this.takeDamage(monster, bullet);
    }

    clearEditorMonsters() {
        this.node.removeAllChildren();
        this.listChar = [];
    }

    onReset() {
        this.unscheduleAllCallbacks();
        this.node.removeAllChildren();
        this.listChar = [];

        this.isGameOver = false;
        this.isWinLevel = true;
        this.spawnedCount = 0;
        this.totalMonsters = 0;
        this.currentWaveData = null;
        this.sumMonsterKill = 0;
        this.recentlyUsedLanes = [];
    }

}
