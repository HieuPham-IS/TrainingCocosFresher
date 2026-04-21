const Emitter = require('mEmitter');
const EventKey = require('EventKey');
const gameConfig = require('GameConfig');

cc.Class({
    extends: cc.Component,

    properties: {
        gameAsset: {
            default: null,
            type: require('GameAsset')
        },
        listBullet: {
            default: [],
            type: [require('Bullet')],
            visible: false
        }
    },
    onLoad() {
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDebugDraw = false

        this.clearEditorPlacedBullets();
        this.registerEvent();
    },
    onDestroy() {
        this.unregisterEvent();
    },
    initBulletByType(type, worldPos) {
        const bullet = this.createBullet(type);
        this.setupBullet(bullet, worldPos);
    },
    createBullet(type) {
        const prefab = this.gameAsset.getBulletPrefabByType(type.NAME);
        const bullet = cc.instantiate(prefab);
        const component = bullet.getComponent('Bullet');
        const initData = this.getBulletInitData(type);
        component.init(initData);
        return { bullet, component };
    },
    getBulletInitData(type) {
        const initData = {
            id: this.generateBulletId(),
            type: type.NAME,
            durationMove: type.DURATION_MOVE,
            damage: type.DAMAGE,
        };

        console.log('getBulletInitData:', initData);
        return initData;
    },
    setupBullet(bulletData, worldPos) {
        const { bullet, component } = bulletData;
        this.addBulletToScene(bullet, worldPos);
        this.addBulletToList(component);
    },
    addBulletToScene(bullet, worldPos) {
        this.node.addChild(bullet);
        this.setBulletPosition(bullet, worldPos);
    },
    addBulletToList(component) {
        this.listBullet.push(component);
        component.onMove();
    },
    setBulletPosition(bullet, worldPos) {
        const nodePos = this.node.convertToNodeSpaceAR(worldPos);
        console.log(`[BulletController] Bullet Local Pos in Scene: x=${nodePos.x.toFixed(2)}, y=${nodePos.y.toFixed(2)}`);
        bullet.setPosition(nodePos.x, nodePos.y);
    },
    generateBulletId() {
        return Date.now() + Math.random();
    },
    registerEvent() {
        this.eventHandles = {
            [EventKey.PLAYER.SHOOT_NORMAL]: this.onShootNormalBullet.bind(this),
        };

        for (const event in this.eventHandles) {
            Emitter.on(event, this.eventHandles[event]);
        }
    },
    unregisterEvent() {
        if (!this.eventHandles) {
            return;
        }

        for (const event in this.eventHandles) {
            Emitter.off(event, this.eventHandles[event]);
        }
        this.eventHandles = null;
    },
    onShootNormalBullet(worldPos) {
        this.initBulletByType(gameConfig.BULLET.TYPE.NORMAL, worldPos);
    },
    clearEditorPlacedBullets() {
        const children = this.node.children.slice();
        children.forEach((child) => {
            if (child.name === 'Bullet') {
                child.destroy();
            }
        });
    }
});
