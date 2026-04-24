import { _decorator, Component, Node, tween, UIOpacity, Vec3 } from 'cc';
import { MonsterItem } from './MonsterItem';
const { ccclass, property } = _decorator;

@ccclass('Monster')
export class Monster extends MonsterItem {
    onMove() {
        this.moveTween = tween(this.node)
            .repeatForever(
                tween()
                    .sequence(
                        tween().by(2, { position: new Vec3(0, 200, 0) }),
                        tween().by(2, { position: new Vec3(0, -200, 0) })
                    )
            )
            .start();
    }

    onDie() {
        if (this.isDying) return;

        this.isDying = true;

        if (this.moveTween) {
            this.moveTween.stop();
            this.moveTween = null;
        }

        let opacity = this.node.getComponent(UIOpacity);

        this.dieTween = tween(opacity)
            .to(0.8, { opacity: 0 })
            .call(() => {
                this.node.destroy();
            })
            .start();
    }
}


