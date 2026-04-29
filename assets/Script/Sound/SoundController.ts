import { _decorator, Component, Node, AudioClip, AudioSource, sys, game, director } from 'cc';
const { ccclass, property } = _decorator;
import { mEmitter } from '../Util/Event/mEmitter';
import { EventKey } from '../Util/Event/EventKey';

@ccclass('SoundController')
export class SoundController extends Component {
    @property({ type: [AudioClip] })
    public bgmList: AudioClip[] = [];

    @property({ type: [AudioClip] })
    public sfxList: AudioClip[] = [];

    @property({ slide: true, range: [0, 1, 0.1] })
    public bgmVolume: number = 1;

    @property({ slide: true, range: [0, 1, 0.1] })
    public sfxVolume: number = 0.5;

    private bgmSource: AudioSource | null = null;
    private sfxSource: AudioSource | null = null;

    private readonly BGM_KEY = 'BGM_VOLUME_KEY';
    private readonly SFX_KEY = 'SFX_VOLUME_KEY';

    onLoad() {
        this.init();
    }

    init() {
        if (game['SOUND_CONTROLLER_EXIST']) {
            this.node.destroy();
            return;
        }
        game['SOUND_CONTROLLER_EXIST'] = true;
        director.addPersistRootNode(this.node);

        this.bgmSource = this.node.getComponent(AudioSource) || this.node.addComponent(AudioSource);
        this.sfxSource = this.node.addComponent(AudioSource);

        this.getStoredVolumes();
        this.registerEvents();

        console.log(`SoundController initialized. BGM: ${this.bgmVolume}, SFX: ${this.sfxVolume}`);
    }

    registerEvents() {
        mEmitter.instance.on(EventKey.SOUND.ENABLE_BGM, this.onEnableBGM, this);
        mEmitter.instance.on(EventKey.SOUND.SET_BGM_VOLUME, this.setBGMVolume, this);
        mEmitter.instance.on(EventKey.SOUND.SET_SFX_VOLUME, this.setSFXVolume, this);
        mEmitter.instance.on(EventKey.SOUND.PLAY_SFX, this.playSFX, this);
        mEmitter.instance.on(EventKey.SOUND.PLAY_BGM, this.playBGM, this);
        mEmitter.instance.on(EventKey.SOUND.STOP_BGM, this.stopBGM, this);

        mEmitter.instance.on(EventKey.GAME.PREPARE_FOR_EXIT, this.onSelfDestroy, this);
    }

    getStoredVolumes() {
        const storedBgm = sys.localStorage.getItem(this.BGM_KEY);
        const storedSfx = sys.localStorage.getItem(this.SFX_KEY);

        if (storedBgm !== null) this.bgmVolume = parseFloat(storedBgm);
        if (storedSfx !== null) this.sfxVolume = parseFloat(storedSfx);

        this.applyVolumes();
    }

    setBGMVolume(newVolume: number) {
        this.bgmVolume = newVolume;
        if (this.bgmSource) this.bgmSource.volume = this.bgmVolume;
        sys.localStorage.setItem(this.BGM_KEY, this.bgmVolume.toString());
    }

    setSFXVolume(newVolume: number) {
        this.sfxVolume = newVolume;
        if (this.sfxSource) this.sfxSource.volume = this.sfxVolume;
        sys.localStorage.setItem(this.SFX_KEY, this.sfxVolume.toString());
    }

    private applyVolumes() {
        if (this.bgmSource) this.bgmSource.volume = this.bgmVolume;
        if (this.sfxSource) this.sfxSource.volume = this.sfxVolume;
    }

    onEnableBGM(isEnabled: boolean, bgmName: string) {
        if (isEnabled) {
            this.playBGM(bgmName);
        } else {
            this.stopBGM();
        }
    }

    playBGM(bgmName: string) {
        const clip = this.bgmList.find(c => c.name === bgmName);
        if (clip && this.bgmSource) {
            this.bgmSource.stop();
            this.bgmSource.clip = clip;
            this.bgmSource.loop = true;
            this.bgmSource.play();
        }
    }

    playSFX(sfxName: string) {
        const clip = this.sfxList.find(c => c.name === sfxName);
        if (clip) {
            this.sfxSource?.playOneShot(clip, this.sfxVolume);
        }
    }

    stopBGM() {
        this.bgmSource?.stop();
    }

    onSelfDestroy() {
        game.removePersistRootNode(this.node);
        this.node.destroy();
    }

    onDestroy() {
        mEmitter.instance.off(EventKey.SOUND.ENABLE_BGM, this.onEnableBGM, this);
        mEmitter.instance.off(EventKey.SOUND.SET_BGM_VOLUME, this.setBGMVolume, this);
        mEmitter.instance.off(EventKey.SOUND.SET_SFX_VOLUME, this.setSFXVolume, this);
        mEmitter.instance.off(EventKey.SOUND.PLAY_SFX, this.playSFX, this);
        mEmitter.instance.off(EventKey.SOUND.PLAY_BGM, this.playBGM, this);
        mEmitter.instance.off(EventKey.SOUND.STOP_BGM, this.stopBGM, this);

        game['SOUND_CONTROLLER_EXIST'] = false;
    }
}