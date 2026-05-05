import { _decorator, Component, Node, Label, sys, game, director } from 'cc';
const { ccclass, property } = _decorator;
import { mEmitter } from '../Util/Event/mEmitter';
import { EventKey } from '../Util/Event/EventKey';

@ccclass('LobbyController')
export class LobbyController extends Component {
    @property(Node)
    popupNode: Node | null = null;

    @property(Label)
    totalGoldLabel: Label | null = null;

    onLoad() {
        this.init();
    }

    init() {
        mEmitter.instance.emit(EventKey.SOUND.PLAY_BGM, "bgm");
        this.updateTotalGold();
        this.registerEvents();
    }

    updateTotalGold() {
        const totalGold = Number(sys.localStorage.getItem('totalGold') || 0);
        if (this.totalGoldLabel) {
            this.totalGoldLabel.string = totalGold.toString();
        }
    }

    start() {
        mEmitter.instance.emit(EventKey.SOUND.PLAY_BGM, "bgm");
        if (this.popupNode && !director.isPersistRootNode(this.popupNode)) {
            director.addPersistRootNode(this.popupNode);
        }
    }

    registerEvents() {
        mEmitter.instance.on('UPDATE_GOLD', this.updateTotalGold, this);
    }

    onClickInfo() {
        mEmitter.instance.emit(EventKey.SOUND.PLAY_SFX, "click");
        mEmitter.instance.emit(EventKey.POPUP.SHOW, "INFOR");
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
        mEmitter.instance.off('UPDATE_GOLD', this.updateTotalGold, this);
    }
}