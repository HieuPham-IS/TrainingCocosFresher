import { _decorator, Component, Node, Prefab, instantiate, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

import { mEmitter } from '../../Util/Event/mEmitter';
import { EventKey } from '../../Util/Event/EventKey';
import { gameConfig } from '../../Util/GameConfig';
import { BulletItem } from './BulletItem';
import { GameAsset } from '../../Util/GameAsset';

@ccclass('BulletController')
export class BulletController extends Component {

    @property(GameAsset)
    gameAsset: GameAsset | null = null;

    listBullet: BulletItem[] = [];

    private eventHandles: Record<string, (...args: any[]) => void> | null = null;

    onLoad(): void {
        this.clearEditorPlacedBullets();
        this.registerEvent();
    }

    onDestroy(): void {
        this.unregisterEvent();
    }

    initBulletByType(type: any, worldPos: Vec3, damageMultiplier: number = 1): void {
        const bulletData = this.createBullet(type, damageMultiplier);
        this.setupBullet(bulletData, worldPos);
    }

    createBullet(type: any, damageMultiplier: number = 1): { bullet: Node, component: BulletItem } {
        const prefab: Prefab = this.gameAsset!.getBulletPrefabByType(type.NAME);
        const bullet = instantiate(prefab);

        const component = bullet.getComponent(BulletItem)!;
        const initData = this.getBulletInitData(type);

        component.init(initData);

        return { bullet, component };
    }

    getBulletInitData(type: any, damageMultiplier: number = 1) {
        const initData = {
            id: this.generateBulletId(),
            type: type.NAME,
            durationMove: type.DURATION_MOVE,
            damage: type.DAMAGE * damageMultiplier,
        };

        // console.log('getBulletInitData:', initData);
        return initData;
    }

    setupBullet(bulletData: { bullet: Node, component: BulletItem }, worldPos: Vec3): void {
        const { bullet, component } = bulletData;

        this.addBulletToScene(bullet, worldPos);
        this.addBulletToList(component);
    }

    addBulletToScene(bullet: Node, worldPos: Vec3): void {
        this.node.addChild(bullet);
        this.setBulletPosition(bullet, worldPos);
    }

    addBulletToList(component: BulletItem): void {
        this.listBullet.push(component);
        component.onMove();
    }

    setBulletPosition(bullet: Node, worldPos: Vec3): void {
        const nodePos = this.node.inverseTransformPoint(new Vec3(), worldPos);

        // console.log(`[BulletController] Bullet Local Pos: x=${nodePos.x.toFixed(2)}, y=${nodePos.y.toFixed(2)}`);

        bullet.setPosition(nodePos);
    }

    generateBulletId(): number {
        return Date.now() + Math.random();
    }

    registerEvent(): void {
        this.eventHandles = {
            [EventKey.PLAYER.SHOOT_NORMAL]: this.onShootNormalBullet.bind(this),
        };

        for (const event in this.eventHandles) {
            mEmitter.instance.on(event, this.eventHandles[event], this);
        }
    }

    unregisterEvent(): void {
        if (!this.eventHandles) return;

        for (const event in this.eventHandles) {
            mEmitter.instance.off(event, this.eventHandles[event], this);
        }

        this.eventHandles = null;
    }

    onShootNormalBullet(worldPos: Vec3, damageMultiplier: number = 1): void {
        this.initBulletByType(gameConfig.BULLET.TYPE.NORMAL, worldPos, damageMultiplier);
    }

    clearEditorPlacedBullets(): void {
        const children = [...this.node.children];

        children.forEach((child) => {
            if (child.name === 'Bullet') {
                child.destroy();
            }
        });
    }
}