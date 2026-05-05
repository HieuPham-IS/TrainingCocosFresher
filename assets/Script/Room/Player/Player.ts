import { _decorator, Component, Node, ProgressBar, sp, tween, Vec3, UIOpacity, Collider2D, Contact2DType, IPhysics2DContact, Label, sys, director } from 'cc';
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
    IDLE = 'idle'
}

@ccclass('Player')
export class Player extends Component {
    @property({ type: ProgressBar })
    hpProgressBar: ProgressBar | null = null;

    @property({ type: Node })
    bulletPointer: Node | null = null;

    @property({ type: ProgressBar })
    expProgressBar: ProgressBar | null = null;

    @property({ type: Label })
    levelLabel: Label | null = null;

    @property
    maxHP: number = 100;

    @property
    moveDuration: number = 0.1;

    @property
    xInit: number = -420;

    @property
    yInit: number = -100;

    @property
    minY: number = -650;

    @property
    maxY: number = 300;

    @property
    moveStep: number = 80;


    public currentHP: number = 0;
    public currentLevel: number = 1;
    public currentExp: number = 0;
    public damageMultiplier: number = 1;
    public fsm: any = null;
    public pendingMove: 'up' | 'down' | null = null;
    public heldMoveDirection: 'up' | 'down' | null = null;
    private playerSpine: sp.Skeleton | null = null;

    onLoad() {
        this.init();
    }

    init() {
        this.playerSpine = this.getComponent(sp.Skeleton)
            ?? this.getComponentInChildren(sp.Skeleton);

        this.currentLevel = Number(sys.localStorage.getItem('playerLevel') || 1);
        this.currentExp = Number(sys.localStorage.getItem('playerExp') || 0);

        this.maxHP = Math.floor(150 * Math.pow(1.15, this.currentLevel - 1));
        this.damageMultiplier = Math.pow(1.15, this.currentLevel - 1);

        this.currentHP = this.maxHP;
        if (this.hpProgressBar) this.hpProgressBar.progress = 1;

        this.node.setPosition(this.xInit, this.yInit, 0);

        this.initStateMachine();

        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }

        mEmitter.instance.on(EventKey.INPUT.SHOOT, this.onShootRequest, this);
        mEmitter.instance.on(EventKey.PLAYER.ADD_EXP, this.onAddExp, this);

        this.updateExpUI();
    }

    onAddExp(exp: number) {
        if (this.fsm.is(FSM_STATE.DIE)) return;

        this.currentExp += exp;
        sys.localStorage.setItem('playerExp', this.currentExp.toString());

        this.checkLevelUp();
        this.updateExpUI();
    }

    checkLevelUp() {
        let maxExp = this.currentLevel * 100;
        let leveledUp = false;

        while (this.currentExp >= maxExp) {
            this.currentExp -= maxExp;
            this.currentLevel++;
            this.damageMultiplier *= 1.15;
            this.maxHP *= 1.15;
            this.currentHP = this.maxHP;
            if (this.hpProgressBar) this.hpProgressBar.progress = this.currentHP / this.maxHP;
            maxExp = this.currentLevel * 100;
            leveledUp = true;
        }

        if (leveledUp) {
            sys.localStorage.setItem('playerLevel', this.currentLevel.toString());
            sys.localStorage.setItem('playerExp', this.currentExp.toString());
        }
    }

    updateExpUI() {
        if (this.expProgressBar) {
            const maxExp = this.currentLevel * 100;
            this.expProgressBar.progress = this.currentExp / maxExp;
        }
        if (this.levelLabel) {
            this.levelLabel.string = `LV ${this.currentLevel}`;
        }
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
                { name: 'toIdle', from: '*', to: FSM_STATE.IDLE },
                { name: 'toMoveUp', from: FSM_STATE.IDLE, to: FSM_STATE.MOVE_UP },
                { name: 'toMoveDown', from: FSM_STATE.IDLE, to: FSM_STATE.MOVE_DOWN },
                { name: 'toDie', from: '*', to: FSM_STATE.DIE },
            ],
            methods: {
                onEnterPortal: () => this.handleEnterPortal(),
                onEnterIdle: () => this.handleEnterIdle(),
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
            this.fsm.toIdle();
            return;
        }
        this.playerSpine.setAnimation(0, 'portal', false);
        this.playerSpine.setCompleteListener((trackEntry) => {
            if (trackEntry && trackEntry.trackIndex !== 0) return;
            this.playerSpine!.setAnimation(0, 'idle', true);
            this.playerSpine!.setCompleteListener(null);
            mEmitter.instance.emit(EventKey.PLAYER.READY);
            this.fsm.toIdle();
        });
    }

    handleEnterIdle() {
        if (!this.pendingMove) return;
        const move = this.pendingMove;
        this.pendingMove = null;
        this.scheduleOnce(() => {
            if (move === 'up' && this.fsm.can('toMoveUp')) this.fsm.toMoveUp();
            else if (move === 'down' && this.fsm.can('toMoveDown')) this.fsm.toMoveDown();
        }, 0);
    }

    onShootRequest() {
        if (director.isPaused() || this.fsm.is(FSM_STATE.DIE) || this.fsm.is(FSM_STATE.PORTAL)) return;
        this.onShootBullet();
    }

    onShootBullet() {
        this.playerSpine?.setAnimation(1, 'shoot', false);
        if (this.bulletPointer) {
            mEmitter.instance.emit(EventKey.PLAYER.SHOOT_NORMAL, this.bulletPointer.worldPosition.clone(), this.damageMultiplier);
        }
    }

    handleEnterMoveUp() {
        if (this.playerSpine) {
            this.playerSpine.setAnimation(0, 'run', true);
        }
        const currentY = this.node.position.y;
        let targetY = currentY + this.moveStep;

        if (targetY > this.maxY) targetY = this.maxY;

        if (targetY === currentY) {
            this.backToIdle();
            return;
        }

        tween(this.node)
            .to(this.moveDuration, {
                position: new Vec3(this.node.position.x, targetY, 0)
            })
            .call(() => this.backToIdle())
            .start();
    }

    handleEnterMoveDown() {
        if (this.playerSpine) {
            this.playerSpine.setAnimation(0, 'run', true);
        }
        const currentY = this.node.position.y;
        let targetY = currentY - this.moveStep;

        if (targetY < this.minY) targetY = this.minY;

        if (targetY === currentY) {
            this.backToIdle();
            return;
        }

        tween(this.node)
            .to(this.moveDuration, {
                position: new Vec3(this.node.position.x, targetY, 0)
            })
            .call(() => this.backToIdle())
            .start();
    }

    private backToIdle() {
        if (this.playerSpine) {
            this.playerSpine.setAnimation(0, 'idle', true);
        }

        this.scheduleOnce(() => {
            if (this.fsm.can('toIdle')) {
                this.fsm.toIdle();
            }
        }, 0);
    }

    takeDamage(amount: number) {
        if (this.fsm.is(FSM_STATE.DIE)) return;
        this.currentHP -= amount;
        if (this.currentHP < 0) this.currentHP = 0;
        if (this.hpProgressBar) this.hpProgressBar.progress = this.currentHP / this.maxHP;

        if (this.currentHP <= 0) {
            this.fsm.toDie();
        } else {
            const opacity = this.getComponent(UIOpacity);
            if (opacity) {
                tween(opacity)
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
                this.node.destroy();
            });
        } else {
            mEmitter.instance.emit(EventKey.PLAYER.ON_DIE, this.node.name);
            this.node.destroy();
        }
    }

    onDestroy() {
        mEmitter.instance.off(EventKey.INPUT.SHOOT, this.onShootRequest, this);
        mEmitter.instance.off(EventKey.PLAYER.ADD_EXP, this.onAddExp, this);
        if (this.playerSpine) this.playerSpine.setCompleteListener(null);
    }
}