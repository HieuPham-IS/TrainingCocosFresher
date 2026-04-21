const Emitter = require('mEmitter');
const EventKey = require('EventKey');

cc.Class({
    extends: cc.Component,

    properties: {
        muzzleNode: {
            default: null,
            type: cc.Node
        },
        minX: {
            default: -300
        },
        maxX: {
            default: 300
        },
        minY: {
            default: -450
        },
        maxY: {
            default: 450
        }
    },


    onLoad() {
        this.init();
    },

    init() {
        this.registerEventListener();
    },

    registerEventListener() {
        this.eventHandles = {
            [EventKey.INPUT.MOVE_UP]: this.onMoveUp.bind(this),
            [EventKey.INPUT.MOVE_DOWN]: this.onMoveDown.bind(this),
            [EventKey.INPUT.MOVE_RIGHT]: this.onMoveRight.bind(this),
            [EventKey.INPUT.MOVE_LEFT]: this.onMoveLeft.bind(this),
            [EventKey.INPUT.SHOOT]: this.onShoot.bind(this)
        };

        for (const event in this.eventHandles) {
            Emitter.on(event, this.eventHandles[event]);
        }
    },

    onDestroy() {
        if (!this.eventHandles) {
            return;
        }
        for (const event in this.eventHandles) {
            Emitter.off(event, this.eventHandles[event]);
        }
        this.eventHandles = null;
    },

    onMoveUp() {
        this.moveBy(0, 50);
    },

    onMoveDown() {
        this.moveBy(0, -50);
    },

    onMoveRight() {
        this.moveBy(50, 0);
    },

    onMoveLeft() {
        this.moveBy(-50, 0);
    },

    moveBy(deltaX, deltaY) {
        const targetX = cc.misc.clampf(this.node.x + deltaX, this.minX, this.maxX);
        const targetY = cc.misc.clampf(this.node.y + deltaY, this.minY, this.maxY);
        if (targetX === this.node.x && targetY === this.node.y) {
            return;
        }
        cc.tween(this.node)
            .to(0.2, { x: targetX, y: targetY })
            .start();
    },

    onShoot() {
        const muzzle = this.muzzleNode || this.node;
        const worldPos = muzzle.convertToWorldSpaceAR(cc.v2(0, 0));
        Emitter.emit(EventKey.PLAYER.SHOOT_NORMAL, worldPos);
    },

    // update (dt) {},
});
