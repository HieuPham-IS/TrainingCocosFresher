const Emitter = require('mEmitter');
const EventKey = require('EventKey');

cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        this.init();
    },

    init() {
        this.forceKeyboardFocus();
        this.registerKeyboardEvent();
        this.registerFocusRecovery();
    },

    registerKeyboardEvent() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyboard, this);
    },

    registerFocusRecovery() {
        cc.systemEvent.on(cc.SystemEvent.EventType.MOUSE_DOWN, this.forceKeyboardFocus, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.TOUCH_START, this.forceKeyboardFocus, this);
    },

    forceKeyboardFocus() {
        if (!cc.sys.isBrowser || !cc.game.canvas) {
            return;
        }

        if (!cc.game.canvas.hasAttribute('tabindex')) {
            cc.game.canvas.setAttribute('tabindex', '1');
        }
        cc.game.canvas.focus();
    },

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyboard, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.MOUSE_DOWN, this.forceKeyboardFocus, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.TOUCH_START, this.forceKeyboardFocus, this);
    },

    onKeyboard(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.up:
                this.onMoveUp();
                break;
            case cc.macro.KEY.down:
                this.onMoveDown();
                break;
            case cc.macro.KEY.right:
                this.onMoveRight();
                break;
            case cc.macro.KEY.left:
                this.onMoveLeft();
                break;
            case cc.macro.KEY.space:
                this.onShoot();
                break;
        }
    },

    onMoveUp() {
        Emitter.emit(EventKey.INPUT.MOVE_UP);
    },

    onMoveDown() {
        Emitter.emit(EventKey.INPUT.MOVE_DOWN);
    },

    onMoveRight() {
        Emitter.emit(EventKey.INPUT.MOVE_RIGHT);
    },

    onMoveLeft() {
        Emitter.emit(EventKey.INPUT.MOVE_LEFT);
    },

    onShoot() {
        Emitter.emit(EventKey.INPUT.SHOOT);
    }
});
