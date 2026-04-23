import { _decorator, Component, Node, tween, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;
import { mEmitter } from '../../Util/Event/mEmitter';
import { EventKey } from '../../Util/Event/EventKey';
import { BulletItem } from './BulletItem';

@ccclass('BulletNormal')
export class BulletNormal extends BulletItem {
    onCollisionEnter(other: any, self: any) {
        this.onCollide(other, self);
    }

    onMove(): void {
        this.moveTween = tween(this.node)
            .by(this.durationMove, { position: new Vec3(1500, 0, 0) })
            .call(() => {
                this.onClear();
            })
            .start();
    }

    onCollide(target: any, self: any): void {
        const worldPos = self.node.worldPosition;
        console.log(`[Bullet] Collided with Monster at WorldPos: x=${worldPos.x.toFixed(2)}, y=${worldPos.y.toFixed(2)}`);
        mEmitter.instance.emit(EventKey.MONSTER.ON_HIT, target.node.getComponent('Monster'), this, worldPos);
        this.onClear();
        console.log("COLLIDE", this.damage, target.node.getComponent('Monster').hp);

    }

    onClear(): void {
        if (this.moveTween) {
            this.moveTween.stop();
            this.moveTween = null;
        }
        if (this.node && this.node.isValid) {
            this.node.destroy();
        }
    }
}

