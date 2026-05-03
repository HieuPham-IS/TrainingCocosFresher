import { _decorator, Component, Node, game, director, Director, find, UITransform } from 'cc';
const { ccclass, property } = _decorator;
import { mEmitter } from '../Util/Event/mEmitter';
import { EventKey } from '../Util/Event/EventKey';

@ccclass('PopupController')
export class PopupController extends Component {
    @property(Node)
    popupSetting: Node | null = null;

    @property(Node)
    popupInfor: Node | null = null;

    @property(Node)
    popupPause: Node | null = null;

    @property(Node)
    popupResult: Node | null = null;

    @property(Node)
    overlay: Node | null = null;

    onLoad() {
        this.init();
    }

    init() {
        if ((game as any).POPUP_CONTROLLER_EXIST) {
            this.node.destroy();
            return;
        }
        (game as any).POPUP_CONTROLLER_EXIST = true;

        const scene = director.getScene();
        if (scene) {
            this.node.setParent(scene);
        }

        this.node.setPosition(0, 0, 0);

        this.hideAllPopup();
        this.registerEvent();
        director.on(Director.EVENT_AFTER_SCENE_LAUNCH, this.updateCanvasParent, this);
    }
    updateCanvasParent() {
        this.scheduleOnce(() => {
            const canvas = find('Canvas');
            if (!canvas) return;

            const canvasUI = canvas.getComponent(UITransform);
            const selfUI = this.node.getComponent(UITransform);
            if (canvasUI && selfUI) {
                selfUI.setContentSize(canvasUI.contentSize);
            }
            this.node.setPosition(0, 0, 0);
        }, 0);
    }

    registerEvent() {
        mEmitter.instance.on(EventKey.POPUP.SHOW, this.showPopup, this);
        mEmitter.instance.on(EventKey.POPUP.HIDE, this.hideAllPopup, this);
        mEmitter.instance.on(EventKey.GAME.PREPARE_FOR_EXIT, this.onSelfDestroy, this);

    }

    showPopup(type: string) {
        console.log('[PopupController] showPopup called, type:', type);
        console.log('[PopupController] popupPause:', this.popupPause);
        console.log('[PopupController] node active:', this.node.active);
        if (this.overlay) this.overlay.active = true;

        switch (type) {
            case "SETTING":
                if (this.popupSetting) this.popupSetting.active = true;
                break;
            case "INFOR":
                if (this.popupInfor) this.popupInfor.active = true;
                break;
            case "PAUSE":
                if (this.popupPause) this.popupPause.active = true;
                break;
            case "RESULT":
                if (this.popupResult) this.popupResult.active = true;
                break;
            default:
                if (this.overlay) this.overlay.active = false;
                break;
        }
    }

    hideAllPopup() {
        if (this.popupSetting) this.popupSetting.active = false;
        if (this.popupInfor) this.popupInfor.active = false;
        if (this.popupPause) this.popupPause.active = false;
        if (this.popupResult) this.popupResult.active = false;
        if (this.overlay) this.overlay.active = false;
    }

    onSelfDestroy() {
        this.hideAllPopup();
        director.removePersistRootNode(this.node);
        this.node.destroy();
    }

    onDestroy() {
        mEmitter.instance.off(EventKey.POPUP.SHOW, this.showPopup, this);
        mEmitter.instance.off(EventKey.POPUP.HIDE, this.hideAllPopup, this);
        mEmitter.instance.off(EventKey.GAME.PREPARE_FOR_EXIT, this.onSelfDestroy, this);
        director.off(Director.EVENT_AFTER_SCENE_LAUNCH, this.updateCanvasParent, this);
        (game as any).POPUP_CONTROLLER_EXIST = false;
    }
}