import { _decorator, Component, Node, Slider, Toggle, sys, director, UITransform } from 'cc';
const { ccclass, property } = _decorator;
import { mEmitter } from '../Util/Event/mEmitter';
import { EventKey } from '../Util/Event/EventKey';

@ccclass('PopupSetting')
export class PopupSetting extends Component {
    @property(Slider) sliderBGM: Slider | null = null;
    @property(Node) progressBGM: Node | null = null;
    @property(Toggle) toggleBGM: Toggle | null = null;

    @property(Slider) sliderSFX: Slider | null = null;
    @property(Node) progressSFX: Node | null = null;
    @property(Toggle) toggleSFX: Toggle | null = null;

    private BGM_VAL_KEY = 'BGM_VOLUME';
    private SFX_VAL_KEY = 'SFX_VOLUME';

    onLoad() {
        this.init();
    }

    init() {
        const volBGM = parseFloat(sys.localStorage.getItem(this.BGM_VAL_KEY) || '0.5');
        const volSFX = parseFloat(sys.localStorage.getItem(this.SFX_VAL_KEY) || '0.5');

        if (this.sliderBGM) {
            this.sliderBGM.progress = volBGM;
            this.updateProgressBar(this.sliderBGM, this.progressBGM);
        }
        if (this.toggleBGM) this.toggleBGM.isChecked = volBGM > 0;

        if (this.sliderSFX) {
            this.sliderSFX.progress = volSFX;
            this.updateProgressBar(this.sliderSFX, this.progressSFX);
        }
        if (this.toggleSFX) this.toggleSFX.isChecked = volSFX > 0;
    }

    private updateProgressBar(slider: Slider, progressNode: Node | null) {
        if (!progressNode) return;
        const uiTrans = slider.node.getComponent(UITransform);
        const progressTrans = progressNode.getComponent(UITransform);
        if (uiTrans && progressTrans) {
            progressTrans.width = slider.progress * uiTrans.contentSize.width;
        }
    }

    onSliderBGMChange() {
        if (!this.sliderBGM) return;
        const vol = this.sliderBGM.progress;
        this.updateProgressBar(this.sliderBGM, this.progressBGM);

        if (this.toggleBGM) this.toggleBGM.isChecked = vol > 0;

        sys.localStorage.setItem(this.BGM_VAL_KEY, vol.toString());
        mEmitter.instance.emit(EventKey.SOUND.SET_BGM_VOLUME, vol);
    }

    onSliderSFXChange() {
        if (!this.sliderSFX) return;
        const vol = this.sliderSFX.progress;
        this.updateProgressBar(this.sliderSFX, this.progressSFX);

        if (this.toggleSFX) this.toggleSFX.isChecked = vol > 0;

        sys.localStorage.setItem(this.SFX_VAL_KEY, vol.toString());
        mEmitter.instance.emit(EventKey.SOUND.SET_SFX_VOLUME, vol);
    }

    onToggleBGM() {
        if (!this.toggleBGM || !this.sliderBGM) return;
        const vol = this.toggleBGM.isChecked ? 0.5 : 0;
        this.sliderBGM.progress = vol;
        this.onSliderBGMChange();
    }

    onToggleSFX() {
        if (!this.toggleSFX || !this.sliderSFX) return;
        const vol = this.toggleSFX.isChecked ? 0.5 : 0;
        this.sliderSFX.progress = vol;
        this.onSliderSFXChange();
    }

    onBack() {
        mEmitter.instance.emit(EventKey.POPUP.HIDE);
        this.node.active = false;
    }
}