const Emitter = require("mEmitter");

cc.Class({
    extends: cc.Component,

    properties: {
        spine: sp.Skeleton
    },

    onLoad() {
        this.startX = this.node.x;
        this.startY = this.node.y;
        this.startScale = this.node.scale;

        if (this.spine) {
            this.spineStartX = this.spine.node.x;
            this.spineStartY = this.spine.node.y;
        }

        this._playAnimBound = this.playAnim.bind(this);
        Emitter.on("PLAY_ANIM", this._playAnimBound);

        Emitter.on("HELLO", this.onHello.bind(this));
        Emitter.once("WELCOME", this.onWelcome.bind(this));
        Emitter.on("MOVE_BY_ACTION", this.playMoveAction.bind(this));
        Emitter.on("MOVE_BY_TWEEN", this.playMoveTween.bind(this));
        Emitter.on("MOVE_BY_TIMELINE", this.playMoveTimeline.bind(this));
        Emitter.on("STOP_ALL", this.resetAndStopAll.bind(this));
    },

    resetAndStopAll() {
        this.node.stopAllActions();

        if (this.spine) {
            let animAnim = this.spine.node.getComponent(cc.Animation);
            if (animAnim) animAnim.stop();

            this.spine.node.setPosition(this.spineStartX, this.spineStartY);
        }

        this.node.setPosition(this.startX, this.startY);
        this.node.angle = 0;

        if (this.startScale !== undefined) {
            this.node.scale = this.startScale;
        }

        if (this.spine) {
            this.spine.clearTracks();
            this.spine.setToSetupPose();
        }
    },

    playAnim(animName) {
        if (!this.spine) {
            return;
        }
        this.spine.setAnimation(0, animName, true);
    },

    onDestroy() {
        Emitter.off("PLAY_ANIM", this._playAnimBound);
    },

    onHello(data) {
        cc.log('hello', data);
    },

    onWelcome(data) {
        cc.log('welcome', data);
    },

    playMoveAction() {
        this.resetAndStopAll();
        cc.log("Run Action");

        let moveRight = cc.moveBy(1, 300, 0);
        let moveLeft = cc.moveBy(1, -300, 0);
        let seq = cc.sequence(moveRight, moveLeft);
        this.node.runAction(cc.repeatForever(seq));
    },

    playMoveTween() {
        this.resetAndStopAll();
        cc.log("Run Tween");

        cc.tween(this.node)
            .to(1, { position: cc.v2(100, 100), angle: -360 })
            .to(1, { scale: 2 })
            .start();
    },

    playMoveTimeline() {
        this.resetAndStopAll();
        cc.log("Run Timeline");

        if (!this.spine) return;

        let animComponent = this.spine.node.getComponent(cc.Animation);
        if (!animComponent) {
            cc.error("Run Timeline Error");
            return;
        }

        animComponent.play();
    }
});
