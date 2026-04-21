cc.Class({
    extends: require('MonsterItem'),

    properties: {

    },

    onMove() {
        this.moveTween = cc.tween(this.node)
            .repeatForever(
                cc.tween().sequence(
                    cc.tween().by(2, { y: 200 }),
                    cc.tween().by(2, { y: -200 })
                )
            )
            .start();
    },

    onDie() {
        if (this._isDying) return;
        this._isDying = true;

        if (this.moveTween) {
            this.moveTween.stop();
        }

        this.dieTween = cc.tween(this.node)
            .to(0.8, { opacity: 0 })
            .call(() => {
                this.node.destroy();
            })
            .start();
    },

});
