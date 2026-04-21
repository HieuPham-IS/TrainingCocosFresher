const EventKey = require('EventKey');
const Emitter = require('mEmitter');
const gameConfig = require('GameConfig');

cc.Class({
    extends: cc.Component,

    properties: {
        monsterPrefab: {
            default: null,
            type: cc.Prefab
        },
        gameAsset: {
            default: null,
            type: require('GameAsset')
        },
        listMonster: {
            default: [],
            type: [require('Monster')],
            visible: false
        },
    },

    onLoad() {
        this.clearEditorPlacedMonsters();
        this.registerEvent();
        this.initializeMonsterList();
    },

    onDestroy() {
        this.unregisterEvent();
        this.clearAllMonsters();
    },

    start() {
        this.spawnMonster(gameConfig.MONSTER.TYPE.DRAGON);
    },

    initializeMonsterList() {
        this.listMonster = [];
    },

    registerEvent() {
        this.eventHandles = {
            [EventKey.MONSTER.ON_DIE]: this.onMonsterDie.bind(this),
            [EventKey.MONSTER.ON_HIT]: this.onMonsterHit.bind(this),
        };

        for (const event in this.eventHandles) {
            Emitter.on(event, this.eventHandles[event]);
        }
    },

    unregisterEvent() {

        for (const event in this.eventHandles) {
            Emitter.off(event, this.eventHandles[event]);
        }
        this.eventHandles = null;
    },

    spawnMonster(type) {
        const monster = this.createMonster(type);
        if (monster) {
            this.addMonsterToScene(monster);
            this.addMonsterToList(monster.getComponent('Monster'));
        }
    },

    createMonster(type) {
        const monsterNode = cc.instantiate(this.monsterPrefab);
        const monsterComponent = monsterNode.getComponent('Monster');
        const monsterData = this.createMonsterData(type);
        monsterComponent.init(monsterData);
        return monsterNode;
    },

    createMonsterData(type) {
        const monsterData = {
            id: this.generateMonsterId(),
            type: type,
            hp: type.HP,
            spriteFrame: this.gameAsset.getSpriteByType(type.NAME)
        };
        console.log('monsterData', monsterData);
        return monsterData;
    },

    addMonsterToScene(monsterNode) {
        this.node.addChild(monsterNode);
        this.setMonsterPosition(monsterNode);
    },

    setMonsterPosition(monsterNode) {
        monsterNode.setPosition(500, 0);
    },

    addMonsterToList(monsterComponent) {
        this.listMonster.push(monsterComponent);
        monsterComponent.onMove();
    },

    removeMonsterFromList(monsterComponent) {
        const index = this.listMonster.indexOf(monsterComponent);
        if (index !== -1) {
            this.listMonster.splice(index, 1);
        }
    },

    onMonsterDie(monsterComponent) {
        this.removeMonsterFromList(monsterComponent);
        if (monsterComponent && monsterComponent.onDie) {
            monsterComponent.onDie();
        }
    },

    onMonsterHit(monster, bullet) {
        this.takeDamage(monster, bullet);
    },

    takeDamage(monster, bullet) {
        this.applyDamage(monster, bullet);
    },

    applyDamage(monster, bullet) {
        monster.hp -= bullet.damage;
        if (monster.hp < 0) {
            monster.hp = 0;
        }
    },

    clearAllMonsters() {
        this.listMonster.forEach(monster => {
            if (monster && monster.node) {
                monster.onDie();
            }
        });
        this.listMonster = [];
    },

    generateMonsterId() {
        return Date.now() + Math.random();
    },

    clearEditorPlacedMonsters() {
        let children = this.node.children.slice();

        children.forEach(child => {
            if (child.name === "Monster") {
                child.destroy();
            }
        });
    }
});
