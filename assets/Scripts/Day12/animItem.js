const Emitter = require("mEmitter");

cc.Class({
    extends: cc.Component,

    properties: {
        label: cc.Label
    },

    init(animName) {
        this.animName = animName;

        if (!this.label) {
            this.label = this.node.getComponentInChildren(cc.Label);
        }

        if (this.label) {
            this.label.string = animName;
        }
    },

    onLoad() {
        this.node.on('click', this.onClick, this);
    },

    onClick() {
        if (this.animName) {
            Emitter.emit("PLAY_ANIM", this.animName);
        }

        this.onHello();
        this.onWelcome();

    },

    onHello() {
        Emitter.emit('HELLO', "hellooooooo");
    },
    onWelcome() {
        Emitter.emit('WELCOME', "Welcomeeeee");
    },

    removeAllEvents() {
        Emitter.removeAllEvents();
    },

    onClickAction() {
        Emitter.emit("MOVE_BY_ACTION");
    },

    onClickTween() {
        Emitter.emit("MOVE_BY_TWEEN");
    },

    onClickTimeline() {
        Emitter.emit("MOVE_BY_TIMELINE");
    },

    onClickStop() {
        Emitter.emit("STOP_ALL");
    }
});
