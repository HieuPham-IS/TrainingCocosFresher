import { _decorator, Component, EventKeyboard, game, Input, input, KeyCode, Node, sys } from 'cc';
const { ccclass, property } = _decorator;
import { mEmitter } from '../../Util/Event/mEmitter';
import { EventKey } from '../../Util/Event/EventKey';

@ccclass('InputController')
export class InputController extends Component {
    onLoad(): void {
        this.init();
    }

    init(): void {
        this.registerKeyboardEvent();
        this.registerKeyboardFocus();
        this.forceKeyboardFocus();
    }

    registerKeyboardEvent(): void {
        input.on(Input.EventType.KEY_DOWN, this.onKeyboard, this);
    }

    registerKeyboardFocus(): void {
        input.on(Input.EventType.MOUSE_DOWN, this.forceKeyboardFocus, this);
        input.on(Input.EventType.TOUCH_START, this.forceKeyboardFocus, this);
    }

    forceKeyboardFocus(): void {
        if (!sys.isBrowser || !game.canvas) return;

        const canvas = game.canvas as HTMLCanvasElement;

        if (!canvas.hasAttribute('tabindex')) {
            canvas.setAttribute('tabindex', '1');
        }

        canvas.focus();
    }

    onDestroy(): void {
        input.off(Input.EventType.KEY_DOWN, this.onKeyboard, this);
        input.off(Input.EventType.MOUSE_DOWN, this.registerKeyboardEvent, this);
        input.off(Input.EventType.TOUCH_START, this.registerKeyboardEvent, this);
    }

    onKeyboard(event: EventKeyboard): void {
        switch (event.keyCode) {
            case KeyCode.ARROW_UP:
                this.onMoveUp();
                break;
            case KeyCode.ARROW_DOWN:
                this.onMoveDown();
                break;
            case KeyCode.SPACE:
                this.onShoot();
                break;
        }
    }

    onMoveUp(): void {
        mEmitter.instance.emit(EventKey.INPUT.MOVE_UP);
    }

    onMoveDown(): void {
        mEmitter.instance.emit(EventKey.INPUT.MOVE_DOWN);
    }

    onShoot(): void {
        mEmitter.instance.emit(EventKey.INPUT.SHOOT);
    }


}

