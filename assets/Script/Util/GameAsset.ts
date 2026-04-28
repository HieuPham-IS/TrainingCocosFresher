import { _decorator, Component, SpriteFrame, Prefab } from 'cc';
const { ccclass, property } = _decorator;

import { gameConfig } from './GameConfig';

@ccclass('GameAsset')
export class GameAsset extends Component {

    @property(SpriteFrame)
    dragonSprite: SpriteFrame | null = null;

    @property(SpriteFrame)
    wolfSprite: SpriteFrame | null = null;

    @property(Prefab)
    normalBulletPrefab: Prefab | null = null;

    @property(Prefab)
    titleWavePrefab: Prefab | null = null;

    @property(SpriteFrame)
    dogSprite: SpriteFrame | null = null;

    getSpriteByType(type: string): SpriteFrame | null {
        switch (type) {
            case gameConfig.MONSTER.TYPE.WOLF.NAME:
                return this.wolfSprite;
            case gameConfig.MONSTER.TYPE.DOG.NAME:
                return this.dogSprite;
            case gameConfig.MONSTER.TYPE.BOSS.NAME:
                return this.dragonSprite;
            default:
                return null;
        }
    }

    getBulletPrefabByType(type: string): Prefab {
        switch (type) {
            case gameConfig.BULLET.TYPE.NORMAL.NAME:
                return this.normalBulletPrefab!;
            default:
                throw new Error(`Bullet prefab not found for type: ${type}`);
        }
    }
    getTitleWavePrefab() {
        return this.titleWavePrefab;
    }
}