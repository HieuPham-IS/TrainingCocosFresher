import { _decorator, Component, Node, Slider, Toggle, sys, director, UITransform } from 'cc';
const { ccclass, property } = _decorator;
import { mEmitter } from '../Util/Event/mEmitter';
import { EventKey } from '../Util/Event/EventKey';

@ccclass('PopupSetting')
export class PopupSetting extends Component {
    @property(Slider)
    sliderBGM: Slider | null = null;

    @property(Node)
    backGroundSliderBGM: Node | null = null;

    @property(Toggle)
    toggleBGM: Toggle | null = null;

    @property(Slider)
    sliderSFX: Slider | null = null;

    @property(Node)
    backGroundSliderSFX: Node | null = null;

    @property(Toggle)
    toggleSFX: Toggle | null = null;

    private BGM_VAL_KEY = 'BGM_VOLUME';
    private SFX_VAL_KEY = 'SFX_VOLUME';
    private enabledBGM = false;
    onLoad() {
        this.init();
    }

    init() {
        const volBGM = parseFloat(sys.localStorage.getItem(this.BGM_VAL_KEY));
        const volSFX = parseFloat(sys.localStorage.getItem(this.SFX_VAL_KEY));
        console.log(volBGM, volSFX);


        this.enabledBGM = true;

        this.sliderBGM.progress = volBGM;
        this.toggleBGM.target.active = false;
        this.backGroundSliderBGM.getComponent(UITransform).width = volBGM * this.sliderBGM.node.getComponent(UITransform).width;

        this.sliderSFX.progress = volSFX;
        this.toggleSFX.target.active = false;
        this.backGroundSliderSFX.getComponent(UITransform).width = volSFX * this.sliderSFX.node.getComponent(UITransform).width;

        const sliderNode = this.sliderSFX.node;
        sliderNode.on(Node.EventType.TOUCH_END, this.onSliderSFXEnd, this);
        sliderNode.on(Node.EventType.TOUCH_CANCEL, this.onSliderSFXEnd, this);
        const handle = this.sliderSFX.handle.node;
        handle.on(Node.EventType.TOUCH_END, this.onSliderSFXEnd, this);
        handle.on(Node.EventType.TOUCH_CANCEL, this.onSliderSFXEnd, this);

    }

    onSliderBGMChange() {
        let volume = this.sliderBGM.progress;
        this.backGroundSliderBGM.getComponent(UITransform).width = volume * this.sliderBGM.node.getComponent(UITransform).width;
        mEmitter.instance.emit(EventKey.SOUND.SET_BGM_VOLUME, volume);

        if (volume === 0) {
            this.toggleBGM.target.active = true;
            this.toggleBGM.checkMark.node.active = false;
            this.toggleBGM.isChecked = false;
            mEmitter.instance.emit(EventKey.SOUND.ENABLE_BGM, false, "bgm");
        } else if (volume !== 0 && this.toggleBGM.target.active === true) {
            this.toggleBGM.target.active = false;
            this.toggleBGM.checkMark.node.active = true;
            this.toggleBGM.isChecked = true;
            mEmitter.instance.emit(EventKey.SOUND.ENABLE_BGM, true, "bgm");
        }
    }

    onSliderSFXChange() {
        let volume = this.sliderSFX.progress;
        this.backGroundSliderSFX.getComponent(UITransform).width = volume * this.sliderSFX.node.getComponent(UITransform).width;
        mEmitter.instance.emit(EventKey.SOUND.SET_SFX_VOLUME, volume);

        if (volume === 0) {
            this.toggleSFX.target.active = true;
            this.toggleSFX.checkMark.node.active = false;
            this.toggleSFX.isChecked = false;
        } else if (volume !== 0 && this.toggleSFX.target.active === true) {
            this.toggleSFX.target.active = false;
            this.toggleSFX.checkMark.node.active = true;
            this.toggleSFX.isChecked = true;
        }
    }

    onToggleBGM() {
        if (!this.toggleBGM.isChecked) {
            this.sliderBGM.progress = 1;
            this.toggleBGM.target.active = false;
            this.toggleBGM.checkMark.node.active = true;

            mEmitter.instance.emit(EventKey.SOUND.SET_BGM_VOLUME, this.sliderBGM.progress);
            mEmitter.instance.emit(EventKey.SOUND.ENABLE_BGM, this.enabledBGM, "bgm");
            this.backGroundSliderBGM.getComponent(UITransform).width = this.sliderBGM.progress * this.sliderBGM.node.getComponent(UITransform).width;
        } else {
            this.toggleBGM.target.active = true;
            this.toggleBGM.checkMark.node.active = false;
            mEmitter.instance.emit(EventKey.SOUND.ENABLE_BGM, !this.enabledBGM, "bgm");
            this.backGroundSliderBGM.getComponent(UITransform).width = 0;
            this.sliderBGM.progress = 0;
        }
    }

    onToggleSFX() {
        if (!this.toggleSFX.isChecked) {

            this.sliderSFX.progress = 1;
            this.toggleSFX.target.active = false;
            this.toggleSFX.checkMark.node.active = true;

            mEmitter.instance.emit(EventKey.SOUND.SET_SFX_VOLUME, this.sliderSFX.progress);
            mEmitter.instance.emit(EventKey.SOUND.PLAY_SFX);
            this.backGroundSliderSFX.getComponent(UITransform).width = this.sliderSFX.progress * this.sliderSFX.node.getComponent(UITransform).width;
        } else {
            this.toggleSFX.target.active = true;
            this.toggleSFX.checkMark.node.active = false;

            mEmitter.instance.emit(EventKey.SOUND.SET_SFX_VOLUME, 0);
            this.backGroundSliderSFX.getComponent(UITransform).width = 0;
            this.sliderSFX.progress = 0;
        }
    }

    onSliderSFXEnd() {
        let volume = this.sliderSFX.progress;

        mEmitter.instance.emit(EventKey.SOUND.SET_SFX_VOLUME, volume);
        mEmitter.instance.emit(EventKey.SOUND.PLAY_SFX, "click");

        if (volume === 0) {
            this.toggleSFX.target.active = true;
            this.toggleSFX.checkMark.node.active = false;
            this.toggleSFX.isChecked = false;
        } else {
            this.toggleSFX.target.active = false;
            this.toggleSFX.checkMark.node.active = true;
            this.toggleSFX.isChecked = true;
        }
    }

    onBack() {
        mEmitter.instance.emit(EventKey.SOUND.PLAY_SFX, "click");

        const sceneName = director.getScene()?.name;
        if (sceneName === 'Room') {
            this.node.active = false;
            mEmitter.instance.emit(EventKey.POPUP.SHOW, "PAUSE");
        } else {
            this.node.active = false;
            mEmitter.instance.emit(EventKey.POPUP.HIDE);
        }
    }
}