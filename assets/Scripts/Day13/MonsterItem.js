const EventKey = require('EventKey');
const Emitter = require('mEmitter');


cc.Class({
    extends: cc.Component,

    properties: {
        id: {
            default: "",
            visible: false
        },
        type: {
            default: "",
            visible: false
        },
        hp: {
            default: 0,
            type: cc.Integer,
            visible: false
        },
        maxHP: {
            default: 0,
            type: cc.Integer,
            visible: false
        },
        hpBar: {
            default: null,
            type: cc.ProgressBar,
        },
        durationMove: {
            default: 0,
            type: cc.Integer,
            visible: false
        },
        sprite: {
            default: null,
            type: cc.Sprite,
        },
    },

    update(dt) {
        if (this.hp < this.maxHP) {
            this.updateHP();
        }

    },

    init(data) {
        this.id = data.id;
        this.type = data.type;
        this.hp = data.hp;
        this.maxHP = data.hp;
        this.damage = data.damage;
        this.durationMove = data.durationMove;
        this.sprite.spriteFrame = data.spriteFrame;
    },
    updateHP() {
        this.updateHPBar();
        if (this.shouldDie()) {
            Emitter.emit(EventKey.MONSTER.ON_DIE, this);
        }
    },
    updateHPBar() {
        this.hpBar.progress = this.hp / this.maxHP;
    },
    shouldDie() {
        return this.hp <= 0;
    },
    onMove() {

    },
    onDie() {

    },

});