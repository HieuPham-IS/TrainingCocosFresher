import { _decorator, Component, Node, ProgressBar, sp, tween, Vec3, UIOpacity, Collider2D, Contact2DType, IPhysics2DContact } from 'cc';
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
    @property({ type: ProgressBar }) hpProgressBar: ProgressBar | null = null;
    @property({ type: Node }) bulletPointer: Node | null = null;
    @property maxHP: number = 100;
    @property moveDuration: number = 0.2;

    private spawnX: number = -600;
    private playerPositionY: number[] = [-300, -175, -50];
    private currentLaneIndex: number = 1;
    public currentHP: number = 0;
    public fsm: any = null;
    private playerSpine: sp.Skeleton | null = null;

    onLoad() {
        this.playerSpine = this.getComponent(sp.Skeleton);
        this.currentHP = this.maxHP;
        if (this.hpProgressBar) this.hpProgressBar.progress = 1;

        this.initStateMachine();

        this.node.setPosition(new Vec3(this.spawnX, this.playerPositionY[this.currentLaneIndex], 0));

        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }

        mEmitter.instance.on(EventKey.INPUT.MOVE_UP, this.onMoveUpRequest, this);
        mEmitter.instance.on(EventKey.INPUT.MOVE_DOWN, this.onMoveDownRequest, this);
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
                onEnterMoveUp: () => this.handleMoveUp(),
                onEnterMoveDown: () => this.handleMoveDown(),
                onEnterDie: () => this.handleEnterDie(),
            },
        });
    }

    handleEnterPortal() {
        if (!this.playerSpine) return;
        this.playerSpine.setCompleteListener((entry) => {
            if (entry.animation.name === 'portal') {
                this.playerSpine.setAnimation(0, 'idle', true);
                mEmitter.instance.emit(EventKey.PLAYER.READY);
                this.safeToShoot();
            }
        });
        this.playerSpine.setAnimation(0, 'portal', false);
    }

    onShootRequest() { if (this.fsm.is(FSM_STATE.SHOOT)) this.onShootBullet(); }
    onMoveUpRequest() { if (this.fsm.can('toMoveUp')) this.fsm.toMoveUp(); }
    onMoveDownRequest() { if (this.fsm.can('toMoveDown')) this.fsm.toMoveDown(); }

    onShootBullet() {
        this.playerSpine?.setAnimation(1, 'shoot', false);
        if (this.bulletPointer) {
            mEmitter.instance.emit(EventKey.PLAYER.SHOOT_NORMAL, this.bulletPointer.worldPosition.clone());
        }
    }

    private handleMoveUp() {
        if (this.currentLaneIndex < 2) {
            this.currentLaneIndex++;
            this.performMove();
        } else { this.safeToShoot(); }
    }

    private handleMoveDown() {
        if (this.currentLaneIndex > 0) {
            this.currentLaneIndex--;
            this.performMove();
        } else { this.safeToShoot(); }
    }

    private performMove() {
        tween(this.node)
            .to(this.moveDuration, { position: new Vec3(this.spawnX, this.playerPositionY[this.currentLaneIndex], 0) })
            .call(() => this.safeToShoot()).start();
    }

    private safeToShoot() {
        this.scheduleOnce(() => { if (this.fsm.can('toShoot')) this.fsm.toShoot(); }, 0);
    }

    takeDamage(amount: number) {
        if (this.fsm.is(FSM_STATE.DIE)) return;
        this.currentHP -= amount;
        if (this.hpProgressBar) this.hpProgressBar.progress = this.currentHP / this.maxHP;
        if (this.currentHP <= 0) {
            this.fsm.toDie();
        } else {
            const opac = this.getComponent(UIOpacity);
            if (opac) tween(opac).to(0.1, { opacity: 100 }).to(0.1, { opacity: 255 }).start();
        }
    }

    handleEnterDie() {
        mEmitter.instance.emit(EventKey.ROOM.GAME_OVER);
        const collider = this.getComponent(Collider2D);
        if (collider) collider.enabled = false;

        if (this.playerSpine) {
            this.playerSpine.setCompleteListener((entry) => {
                if (entry.animation.name === 'death') {
                    this.startFadeOut();
                }
            });
            this.playerSpine.setAnimation(0, 'death', false);
        } else {
            this.startFadeOut();
        }
    }

    private startFadeOut() {
        let opacity = this.getComponent(UIOpacity);
        if (!opacity) opacity = this.node.addComponent(UIOpacity);
        tween(opacity)
            .to(0.8, { opacity: 0 })
            .call(() => {
                mEmitter.instance.emit(EventKey.PLAYER.ON_DIE, this.node.name);
                if (this.node.parent) this.node.parent.destroy();
                else this.node.destroy();
            }).start();
    }

    onDestroy() {
        mEmitter.instance.off(EventKey.INPUT.MOVE_UP, this.onMoveUpRequest, this);
        mEmitter.instance.off(EventKey.INPUT.MOVE_DOWN, this.onMoveDownRequest, this);
        mEmitter.instance.off(EventKey.INPUT.SHOOT, this.onShootRequest, this);
    }
}