import { _decorator, Component, Node, tween, Vec3, Collider2D, Contact2DType, IPhysics2DContact, log } from 'cc';
const { ccclass, property } = _decorator;
import { mEmitter } from '../../Util/Event/mEmitter';
import { EventKey } from '../../Util/Event/EventKey';
import { BulletItem } from './BulletItem';

@ccclass('BulletNormal')
export class BulletNormal extends BulletItem {

    protected onLoad(): void {
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    onBeginContact(self: Collider2D, other: Collider2D, contact: IPhysics2DContact | null) {

        const monster = other.getComponent('Monster') || other.node.getComponent('Monster');

        if (!monster || !monster.node || !monster.node.isValid) {
            return;
        }
        const worldPos = self.node.worldPosition;
        mEmitter.instance.emit(EventKey.MONSTER.ON_HIT, monster, this, worldPos);
        // console.log("COLLIDE - Damage:", this.damage, "Monster HP:", (monster as any).hp);
        this.onClear();

    }

    onMove(): void {
        this.moveTween = tween(this.node)
            .by(this.durationMove, { position: new Vec3(1500, 0, 0) })
            .call(() => {
                this.onClear();
            })
            .start();
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

