import { _decorator, Component, Node, Label, sys, game, director } from 'cc';
const { ccclass, property } = _decorator;
import { mEmitter } from '../Util/Event/mEmitter';
import { EventKey } from '../Util/Event/EventKey';

@ccclass('LobbyController')
export class LobbyController extends Component {
    @property(Node)
    popupNode: Node | null = null;


    onLoad() {
        this.init();
    }



    init() {
        mEmitter.instance.emit(EventKey.SOUND.PLAY_BGM, "bgm");
        this.registerEvents();
    }

    start() {
        mEmitter.instance.emit(EventKey.SOUND.PLAY_BGM, "bgm");
        if (this.popupNode && !director.isPersistRootNode(this.popupNode)) {
            director.addPersistRootNode(this.popupNode);
        }
    }

    registerEvents() {
    }

    onClickSetting() {
        mEmitter.instance.emit(EventKey.SOUND.PLAY_SFX, "click");
        mEmitter.instance.emit(EventKey.POPUP.SHOW, "SETTING");
    }

    onClickStart() {
        mEmitter.instance.emit(EventKey.SOUND.PLAY_SFX, "click");
        sys.localStorage.setItem('targetScene', 'Room');
        director.loadScene('Loading');
    }

    onDestroy() {

    }
}