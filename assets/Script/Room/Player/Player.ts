import { _decorator, Component, Node, ProgressBar, sp, tween, Vec3, UIOpacity, Collider2D, Contact2DType, IPhysics2DContact, RigidBody2D, ERigidBody2DType } from 'cc';
import StateMachine from 'javascript-state-machine';
import { mEmitter } from '../../Util/Event/mEmitter';
import { EventKey } from '../../Util/Event/EventKey';
import { MonsterItem } from '../Monster/MonsterItem';

const { ccclass, property } = _decorator;

enum FSM_STATE {
    PORTAL = 'portal',
    SHOOT = 'shoot',
    MOVE_UP = 'moveUp',
    MOVE_DOWN = 'moveDown',
    DIE = 'die',
}

@ccclass('Player')
export class Player extends Component {
    @property({ type: ProgressBar })
    hpProgressBar: ProgressBar | null = null;

    @property({ type: Node })
    bulletPointer: Node | null = null;

    @property
    maxHP: number = 100;

    @property
    moveDuration: number = 0.1;

    @property
    xInit: number = -420;

    @property
    yInit: number = -100;

    private playerPositionY: number[] = [-450, -200, 250];

    public currentHP: number = 0;
    public fsm: any = null;
    public pendingMove: 'up' | 'down' | null = null;
    private playerSpine: sp.Skeleton | null = null;

    onLoad() {
        this.init();
    }

    init() {
        this.playerSpine = this.getComponent(sp.Skeleton)
            ?? this.getComponentInChildren(sp.Skeleton);

        this.currentHP = this.maxHP;
        if (this.hpProgressBar) this.hpProgressBar.progress = 1;

        this.node.setPosition(this.xInit, this.yInit, 0);

        this.initStateMachine();

        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }

        mEmitter.instance.on(EventKey.INPUT.SHOOT, this.onShootRequest, this);
    }

    onBeginContact(self: Collider2D, other: Collider2D, contact: IPhysics2DContact | null) {
        const monster = other.node.getComponent(MonsterItem);
        if (monster && !this.fsm.is(FSM_STATE.DIE)) {
            this.takeDamage(monster.damage);
            mEmitter.instance.emit(EventKey.MONSTER.ON_DIE, monster);
        }
    }

    initStateMachine() {
        this.fsm = new StateMachine({
            init: FSM_STATE.PORTAL,
            transitions: [
                { name: 'toPortal', from: '*', to: FSM_STATE.PORTAL },
                { name: 'toShoot', from: '*', to: FSM_STATE.SHOOT },
                { name: 'toMoveUp', from: FSM_STATE.SHOOT, to: FSM_STATE.MOVE_UP },
                { name: 'toMoveDown', from: FSM_STATE.SHOOT, to: FSM_STATE.MOVE_DOWN },
                { name: 'toDie', from: '*', to: FSM_STATE.DIE },
            ],
            methods: {
                onEnterPortal: () => this.handleEnterPortal(),
                onEnterShoot: () => this.handleEnterShoot(),
                onEnterMoveUp: () => this.handleEnterMoveUp(),
                onEnterMoveDown: () => this.handleEnterMoveDown(),
                onEnterDie: () => this.handleEnterDie(),
                onLeavePortal: () => this.playerSpine?.setCompleteListener(null),
            },
        });
    }

    handleEnterPortal() {
        if (!this.playerSpine) {
            mEmitter.instance.emit(EventKey.PLAYER.READY);
            this.fsm.toShoot();
            return;
        }
        this.playerSpine.setAnimation(0, 'portal', false);
        this.playerSpine.setCompleteListener(() => {
            this.playerSpine!.setAnimation(0, 'idle', true);
            this.playerSpine!.setCompleteListener(null);
            mEmitter.instance.emit(EventKey.PLAYER.READY);
            this.fsm.toShoot();
        });
    }

    handleEnterShoot() {
        if (!this.pendingMove) return;
        const move = this.pendingMove;
        this.pendingMove = null;
        this.scheduleOnce(() => {
            if (move === 'up' && this.fsm.can('toMoveUp')) this.fsm.toMoveUp();
            else if (move === 'down' && this.fsm.can('toMoveDown')) this.fsm.toMoveDown();
        }, 0);
    }

    onShootRequest() {
        if (!this.fsm.is(FSM_STATE.SHOOT)) return;
        this.onShootBullet();
    }

    onShootBullet() {
        this.playerSpine?.setAnimation(1, 'shoot', false);
        if (this.bulletPointer) {
            mEmitter.instance.emit(EventKey.PLAYER.SHOOT_NORMAL, this.bulletPointer.worldPosition.clone());
        }
    }

    handleEnterMoveUp() {
        const currentY = this.node.position.y;
        let targetY = currentY;

        if (currentY === this.playerPositionY[0]) {
            targetY = this.playerPositionY[1];
        } else if (currentY === this.playerPositionY[1]) {
            targetY = this.playerPositionY[2];
        }

        if (targetY === currentY) { this.scheduleOnce(() => { if (this.fsm.can('toShoot')) this.fsm.toShoot(); }, 0); return; }

        tween(this.node)
            .to(this.moveDuration, { position: new Vec3(this.node.position.x, targetY, 0) })
            .call(() => this.scheduleOnce(() => { if (this.fsm.can('toShoot')) this.fsm.toShoot(); }, 0))
            .start();
    }

    handleEnterMoveDown() {
        const currentY = this.node.position.y;
        let targetY = currentY;

        if (currentY === this.playerPositionY[2]) {
            targetY = this.playerPositionY[1];
        } else if (currentY === this.playerPositionY[1]) {
            targetY = this.playerPositionY[0];
        }

        if (targetY === currentY) { this.scheduleOnce(() => { if (this.fsm.can('toShoot')) this.fsm.toShoot(); }, 0); return; }

        tween(this.node)
            .to(this.moveDuration, { position: new Vec3(this.node.position.x, targetY, 0) })
            .call(() => this.scheduleOnce(() => { if (this.fsm.can('toShoot')) this.fsm.toShoot(); }, 0))
            .start();
    }

    takeDamage(amount: number) {
        if (this.fsm.is(FSM_STATE.DIE)) return;
        this.currentHP -= amount;
        if (this.currentHP < 0) this.currentHP = 0;
        if (this.hpProgressBar) this.hpProgressBar.progress = this.currentHP / this.maxHP;

        if (this.currentHP <= 0) {
            this.fsm.toDie();
        } else {
            const opac = this.getComponent(UIOpacity);
            if (opac) {
                tween(opac)
                    .to(0.1, { opacity: 80 })
                    .to(0.1, { opacity: 255 })
                    .to(0.1, { opacity: 80 })
                    .to(0.1, { opacity: 255 })
                    .start();
            }
        }
    }

    handleEnterDie() {
        mEmitter.instance.emit(EventKey.ROOM.GAME_OVER);
        this.pendingMove = null;

        const collider = this.getComponent(Collider2D);
        if (collider) collider.enabled = false;

        if (this.playerSpine) {
            this.playerSpine.setAnimation(0, 'death', false);
            this.playerSpine.setCompleteListener(() => {
                mEmitter.instance.emit(EventKey.PLAYER.ON_DIE, this.node.name);
                this.playerSpine!.setCompleteListener(null);
                if (this.node.parent) this.node.parent.destroy();
                else this.node.destroy();
            });
        } else {
            mEmitter.instance.emit(EventKey.PLAYER.ON_DIE, this.node.name);
            if (this.node.parent) this.node.parent.destroy();
            else this.node.destroy();
        }
    }

    onDestroy() {
        mEmitter.instance.off(EventKey.INPUT.SHOOT, this.onShootRequest, this);
        if (this.playerSpine) this.playerSpine.setCompleteListener(null);
    }
}