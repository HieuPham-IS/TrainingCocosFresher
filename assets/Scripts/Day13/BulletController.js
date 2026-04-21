const Emitter = require('mEmitter');
const EventKey = require('EventKey');

const NORMAL_BULLET = {
    NAME: 'normal',
    DURATION_MOVE: 1.2,
    DAMAGE: 10,
};

cc.Class({
    extends: cc.Component,

    properties: {
        bulletPrefab: {
            default: null,
            type: cc.Prefab
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
        const prefab = this.bulletPrefab;
        const bullet = cc.instantiate(prefab);
        const component = bullet.getComponent('BulletNormal');
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
        this.initBulletByType(NORMAL_BULLET, worldPos);
    },
    clearEditorPlacedBullets() {
        const children = this.node.children.slice();
        children.forEach((child) => {
            if (child.name === 'Bullet') {
                child.destroy();
            }
        });
    },
    clearAllBullets() {
        this.listBullet.forEach((bullet) => {
            if (bullet && bullet.node) {
                bullet.onClear();
            }
        });
        this.listBullet = [];
    }
});
