import { _decorator, Component, log, math, Node, sp, tween, Vec3, Camera, view } from 'cc';
const { ccclass, property } = _decorator;
import { mEmitter } from '../../Util/Event/mEmitter';
import { EventKey } from '../../Util/Event/EventKey';

@ccclass('CharacterController')
export class CharacterController extends Component {
    @property(Node)
    muzzleNode: Node | null = null;

    @property(Camera)
    camera: Camera | null = null;

    private halfW: number = 0;
    private halfH: number = 0;


    private spine: sp.Skeleton | null = null;
    private isMoving: boolean = false;
    private currentAnim: string = '';
    private lastMoveTime: number = 0;
    private eventHandles: Record<string, (...args: any[]) => void> | null = null;

    onLoad(): void {
        this.spine = this.getComponent(sp.Skeleton) || this.getComponentInChildren(sp.Skeleton);
        console.log(this.spine);
        this.registerListenerEvent();
        this.updateAnimation();
        this.updateCameraBounds();

    }

    update(deltaTime: number) {
        if (this.isMoving && Date.now() - this.lastMoveTime > 100) {
            this.isMoving = false;
            this.updateAnimation();
        }
    }

    onDestroy(): void {
        this.unregisterListenerEvent();
    }

    registerListenerEvent(): void {
        this.eventHandles = {
            [EventKey.INPUT.MOVE_UP]: this.onMove.bind(this, 0, 50),
            [EventKey.INPUT.MOVE_DOWN]: this.onMove.bind(this, 0, -50),
            [EventKey.INPUT.SHOOT]: this.onShoot.bind(this)
        };

        for (const event in this.eventHandles) {
            mEmitter.instance.on(event, this.eventHandles[event], this);
        }
    }

    unregisterListenerEvent(): void {
        if (!this.eventHandles) return;

        for (const event in this.eventHandles) {
            mEmitter.instance.off(event, this.eventHandles[event], this);
        }

        this.eventHandles = null;

    }

    onMove(dx: number, dy: number): void {
        this.moveBy(dx, dy);
        this.isMoving = true;
        this.lastMoveTime = Date.now();
        this.updateAnimation();
    }

    updateCameraBounds() {
        if (!this.camera) return;

        const visibleSize = view.getVisibleSize();

        this.halfW = visibleSize.width / 2;
        this.halfH = visibleSize.height / 2;
    }
    moveBy(dx: number, dy: number): void {
        const pos = this.node.position.clone();

        pos.x += dx;
        pos.y += dy;

        pos.x = Math.max(-this.halfW, Math.min(this.halfW, pos.x));
        pos.y = Math.max(-this.halfH, Math.min(this.halfH, pos.y));

        this.node.setPosition(pos);
    }

    onShoot(): void {
        const muzzle = this.muzzleNode || this.node;
        const worldPos = muzzle.worldPosition.clone();

        mEmitter.instance.emit(EventKey.PLAYER.SHOOT_NORMAL, worldPos);

        if (this.spine) {
            this.spine.setAnimation(1, "shoot", false);
            this.spine.addAnimation(0, this.isMoving ? "run" : "idle", true);
        }
    }

    playAnimation(name: string, loop: boolean): void {
        if (!this.spine) return;
        if (this.currentAnim === name) return;

        this.currentAnim = name;
        this.spine.setAnimation(0, name, loop);
    }

    updateAnimation(): void {
        if (!this.spine) return;

        if (this.isMoving) {
            this.playAnimation("run", true);
        } else {
            this.playAnimation("idle", true);
        }
    }
}

