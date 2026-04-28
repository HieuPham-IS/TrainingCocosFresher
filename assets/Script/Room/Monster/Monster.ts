import { _decorator, Component, Node, tween, UIOpacity, Vec3 } from 'cc';
import { MonsterItem } from './MonsterItem';
import { mEmitter } from '../../Util/Event/mEmitter';
import { EventKey } from '../../Util/Event/EventKey';
const { ccclass, property } = _decorator;

@ccclass('Monster')
export class Monster extends MonsterItem {
    onMove() {
        const randomSpeedFactor = 0.9 + Math.random() * 0.2;
        const adjustedDuration = 2 * randomSpeedFactor;

        this.moveTween = tween(this.node)
            .repeatForever(
                tween()
                    .by(adjustedDuration, { position: new Vec3(-100, 0, 0) })
            )
            .start();

    }

    onDie() {
        if (this.isDying || !this.node || !this.node.isValid) return;

        this.isDying = true;

        if (this.moveTween) {
            this.moveTween.stop();
            this.moveTween = null;
        }

        let opacity = this.node.getComponent(UIOpacity);

        this.dieTween = tween(opacity)
            .to(0.1, { opacity: 0 })
            .call(() => {
                this.node.destroy();
            })
            .start();
    }
}


