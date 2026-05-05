import { _decorator, Component, EventKeyboard, game, Input, input, KeyCode, Node, sys } from 'cc';
const { ccclass, property } = _decorator;
import { mEmitter } from '../../Util/Event/mEmitter';
import { EventKey } from '../../Util/Event/EventKey';

@ccclass('InputController')
export class InputController extends Component {
    private isUpPressed: boolean = false;
    private isDownPressed: boolean = false;
    private readonly moveRepeatInterval: number = 0.08;

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
        input.on(Input.EventType.KEY_UP, this.onKeyboardUp, this);
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
        input.off(Input.EventType.KEY_UP, this.onKeyboardUp, this);
        input.off(Input.EventType.MOUSE_DOWN, this.forceKeyboardFocus, this);
        input.off(Input.EventType.TOUCH_START, this.forceKeyboardFocus, this);
        this.unschedule(this.repeatMoveUp);
        this.unschedule(this.repeatMoveDown);
    }

    onKeyboard(event: EventKeyboard): void {
        switch (event.keyCode) {
            case KeyCode.ARROW_UP:
                this.handleMoveUpPress();
                break;
            case KeyCode.ARROW_DOWN:
                this.handleMoveDownPress();
                break;
            case KeyCode.SPACE:
                this.onShoot();
                break;
        }
    }

    onKeyboardUp(event: EventKeyboard): void {
        switch (event.keyCode) {
            case KeyCode.ARROW_UP:
                this.handleMoveUpRelease();
                break;
            case KeyCode.ARROW_DOWN:
                this.handleMoveDownRelease();
                break;
        }
    }

    private handleMoveUpPress(): void {
        if (this.isUpPressed) return;
        this.isUpPressed = true;
        this.onMoveUp();
        this.schedule(this.repeatMoveUp, this.moveRepeatInterval);
    }

    private handleMoveDownPress(): void {
        if (this.isDownPressed) return;
        this.isDownPressed = true;
        this.onMoveDown();
        this.schedule(this.repeatMoveDown, this.moveRepeatInterval);
    }

    private handleMoveUpRelease(): void {
        this.isUpPressed = false;
        this.unschedule(this.repeatMoveUp);
        mEmitter.instance.emit(EventKey.INPUT.MOVE_UP_RELEASE);
    }

    private handleMoveDownRelease(): void {
        this.isDownPressed = false;
        this.unschedule(this.repeatMoveDown);
        mEmitter.instance.emit(EventKey.INPUT.MOVE_DOWN_RELEASE);
    }

    private repeatMoveUp = (): void => {
        if (this.isUpPressed) {
            this.onMoveUp();
        }
    };

    private repeatMoveDown = (): void => {
        if (this.isDownPressed) {
            this.onMoveDown();
        }
    };

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

