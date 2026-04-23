import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BulletItem')
export class BulletItem extends Component {
    @property({ visible: false })
    id: string = "";

    @property({ type: Number, visible: false })
    durationMove: number = 0;

    @property({ type: Number, visible: false })
    damage: number = 0;

    @property({ visible: false })
    type: string = "";

    protected moveTween: any = null;

    init(data: any): void {
        this.id = data.id;
        this.durationMove = data.durationMove;
        this.damage = data.damage;
        this.type = data.type;
    }

    onMove() {

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

