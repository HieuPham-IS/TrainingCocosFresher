const gameConfig = require('GameConfig');

cc.Class({
    extends: cc.Component,

    properties: {
        dragonSprite: {
            default: null,
            type: cc.SpriteFrame
        },
        normalBulletPrefab: {
            default: null,
            type: cc.Prefab
        }
    },

    getSpriteByType(type) {
        switch (type) {
            case gameConfig.MONSTER.TYPE.DRAGON.NAME:
                return this.dragonSprite;
        }
    },

    getBulletPrefabByType(type) {
        switch (type) {
            case gameConfig.BULLET.TYPE.NORMAL.NAME:
                return this.normalBulletPrefab;
        }
    }
});