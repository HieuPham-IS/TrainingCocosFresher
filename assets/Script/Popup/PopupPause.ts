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
        if (this.popupSetting) {
            this.popupSetting.active = true;

        }
    }

    onResetGame() {
        director.resume();
        const sceneName = director.getScene()?.name;
        if (sceneName) {
            director.loadScene(sceneName);
        }
    }

    onGoHome() {
        director.resume();
        director.loadScene('Lobby');
    }
}