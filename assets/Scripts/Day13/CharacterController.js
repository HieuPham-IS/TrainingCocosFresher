const Emitter = require('mEmitter');
const EventKey = require('EventKey');

cc.Class({
    extends: cc.Component,

    properties: {
        muzzleNode: {
            default: null,
            type: cc.Node
        },
        minX: -300,
        maxX: 300,
        minY: -450,
        maxY: 450
    },

    onLoad() {
        this.spine = this.getComponent(sp.Skeleton) || this.getComponentInChildren(sp.Skeleton);
        this.isMoving = false;
        this.isShooting = false;
        this.currentAnim = "";
        this.lastMoveTime = 0;
        this.registerEventListener();
        this.updateAnimation();
    },

    update(dt) {
        if (this.isMoving && Date.now() - this.lastMoveTime > 100) {
            this.isMoving = false;
            this.updateAnimation();
        }
    },

    onDestroy() {
        this.unregisterEventListener();
    },

    registerEventListener() {
        this.eventHandles = {
            [EventKey.INPUT.MOVE_UP]: this.onMove.bind(this, 0, 50),
            [EventKey.INPUT.MOVE_DOWN]: this.onMove.bind(this, 0, -50),
            [EventKey.INPUT.MOVE_LEFT]: this.onMove.bind(this, -50, 0),
            [EventKey.INPUT.MOVE_RIGHT]: this.onMove.bind(this, 50, 0),
            [EventKey.INPUT.SHOOT]: this.onShoot.bind(this)
        };

        for (let event in this.eventHandles) {
            Emitter.on(event, this.eventHandles[event]);
        }
    },

    unregisterEventListener() {
        if (!this.eventHandles) return;
        for (let event in this.eventHandles) {
            Emitter.off(event, this.eventHandles[event]);
        }
        this.eventHandles = null;
    },

    onMove(dx, dy) {
        this.moveBy(dx, dy);
        this.isMoving = true;
        this.lastMoveTime = Date.now();
        this.updateAnimation();
    },

    moveBy(dx, dy) {
        const targetX = cc.misc.clampf(this.node.x + dx, this.minX, this.maxX);
        const targetY = cc.misc.clampf(this.node.y + dy, this.minY, this.maxY);
        if (targetX === this.node.x && targetY === this.node.y) return;
        cc.tween(this.node)
            .to(0.15, { x: targetX, y: targetY })
            .start();
    },

    onShoot() {
        const muzzle = this.muzzleNode || this.node;
        const worldPos = muzzle.convertToWorldSpaceAR(cc.v2(0, 0));

        Emitter.emit(EventKey.PLAYER.SHOOT_NORMAL, worldPos);

        this.spine.setAnimation(0, "shoot", false);
        this.spine.addAnimation(0, this.isMoving ? "run" : "idle", true);
    },

    playAnim(name, loop) {
        if (!this.spine) return;
        if (this.currentAnim === name) return;
        this.currentAnim = name;
        this.spine.setAnimation(0, name, loop);
    },

    updateAnimation() {
        if (!this.spine) return;

        if (this.isMoving) {
            this.playAnim("run", true);
        } else {
            this.playAnim("idle", true);
        }
    }
});