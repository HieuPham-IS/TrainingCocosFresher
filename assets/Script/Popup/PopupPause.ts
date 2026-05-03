import { _decorator, Component, Node, director, Button } from 'cc';
const { ccclass, property } = _decorator;
import { mEmitter } from '../Util/Event/mEmitter';
import { EventKey } from '../Util/Event/EventKey';

@ccclass('PopupPause')
export class PopupPause extends Component {
    @property(Node)
    popupSetting: Node | null = null;

    onEnable() {
        director.pause();
    }

    onBack() {
        director.resume();
        mEmitter.instance.emit(EventKey.POPUP.HIDE);
        this.node.active = false;
    }

    onOpenSetting() {
        mEmitter.instance.emit(EventKey.SOUND.PLAY_SFX, "click");
        if (this.popupSetting) {
            this.popupSetting.active = true;
        }
    }

    onResetGame() {
        director.resume();
        mEmitter.instance.emit(EventKey.SOUND.PLAY_SFX, "click");
        mEmitter.instance.emit(EventKey.ROOM.RESET);
        mEmitter.instance.emit(EventKey.POPUP.HIDE);
        this.node.active = false;
    }

    onGoHome() {

        mEmitter.instance.emit(EventKey.POPUP.HIDE);
        this.node.active = false;
        mEmitter.instance.emit(EventKey.ROOM.EXIT);
        director.resume();
    }
}