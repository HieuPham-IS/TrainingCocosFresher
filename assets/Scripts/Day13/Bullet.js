cc.Class({
    extends: cc.Component,

    properties: {
        id: {
            default: "",
            visible: false
        },
        durationMove: {
            default: 0,
            type: cc.Float,
            visible: false
        },
        damage: {
            default: 0,
            type: cc.Float,
            visible: false
        },
        type: {
            default: "",
            visible: false
        },


    },

    init(data) {
        this.id = data.id;
        this.type = data.type;
        this.durationMove = data.durationMove;
        this.damage = data.damage;
    },

    onMove() {

    },

    onClear() {
        if (this.moveTween) {
            this.moveTween.stop();
            this.moveTween = null;
        }
        if (this.node && this.node.isValid) {
            this.node.destroy();
        }
    },

    // update (dt) {},
});