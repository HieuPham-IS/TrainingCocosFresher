const Emitter = require('mEmitter');
const EventKey = require('EventKey');
cc.Class({
    extends: require('Bullet'),

    properties: {

    },

    onCollisionEnter(other, self) {
        this.onCollide(other, self);
    },

    onMove() {
        this.tween = cc.tween(this.node);
        this.tween.by(this.durationMove, { x: 900 })
            .call(() => {
                this.onClear();
            })
            .start();
    },

    onCollide(target, self) {
        const worldPos = self.node.convertToWorldSpaceAR(cc.v2(0, 0));
        console.log(`[Bullet] Collided with Monster at WorldPos: x=${worldPos.x.toFixed(2)}, y=${worldPos.y.toFixed(2)}`);
        Emitter.emit(EventKey.MONSTER.ON_HIT, target.getComponent('Monster'), this, worldPos);
        this.onClear();
        cc.log("COLLIDE", this.damage, target.getComponent('Monster').hp);
    },

    onClear() {
        if (this.tween) {
            this.tween.stop();
            this.tween = null;
        }
        if (this.node && this.node.isValid) {
            this.node.destroy();
        }
    },
});
