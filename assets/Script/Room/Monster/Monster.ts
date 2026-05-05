import { _decorator, Component, Node, tween, UIOpacity, Vec3 } from 'cc';
import { MonsterItem } from './MonsterItem';
import { mEmitter } from '../../Util/Event/mEmitter';
import { EventKey } from '../../Util/Event/EventKey';
import { gameConfig } from '../../Util/GameConfig';
const { ccclass, property } = _decorator;

@ccclass('Monster')
export class Monster extends MonsterItem {
    onMove() {
        const adjustedDuration = this.durationMove;

        this.moveTween = tween(this.node)
            .repeatForever(
                tween()
                    .by(adjustedDuration, { position: new Vec3(-100, 0, 0) })
            )
            .start();
    }

    update(deltaTime: number) {
        super.update(deltaTime);

        if (this.isDying) return;

        const worldX = this.node.worldPosition.x;
        if (worldX <= gameConfig.MONSTER.PASS_POSITION_X) {
            mEmitter.instance.emit(EventKey.MONSTER.ON_DIE, this);
        }
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


