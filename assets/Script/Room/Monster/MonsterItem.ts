import { _decorator, Component, Node, ProgressBar, Sprite, Tween, UIOpacity } from 'cc';
import { mEmitter } from '../../Util/Event/mEmitter';
import { EventKey } from '../../Util/Event/EventKey';
const { ccclass, property } = _decorator;

@ccclass('MonsterItem')
export class MonsterItem extends Component {
    @property({ visible: false })
    id: string = "";

    @property({ visible: false })
    type: string = "";

    @property({ type: Number, visible: false })
    hp: number = 0;

    @property(ProgressBar)
    hpBar: ProgressBar | null = null;

    @property({ type: Number, visible: false })
    durationMove: number = 0;

    @property(Sprite)
    sprite: Sprite | null = null;

    protected moveTween: Tween<Node> = null;
    protected dieTween: Tween<UIOpacity> = null;
    protected isDying: boolean = false;

    update(deltaTime: number) {

    }

    init(data: any) {
        this.id = data.id;
        this.type = data.type;
        this.hp = data.hp;
        this.durationMove = data.durationMove;
        this.sprite.spriteFrame = data.spriteFrame;
    }

    onMove() {

    }

    onDie() {

    }

    shouldDie() {
        return this.hp <= 0;
    }

    updateHP() {
        this.updateHPBar();
        if (this.shouldDie()) {
            mEmitter.instance.emit(EventKey.MONSTER.ON_DIE, this);
        }
    }

    updateHPBar() {

    }
}

