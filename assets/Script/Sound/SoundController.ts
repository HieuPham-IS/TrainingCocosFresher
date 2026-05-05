import { _decorator, Component, Node, AudioClip, AudioSource, game, sys, director } from 'cc';
const { ccclass, property } = _decorator;

import { mEmitter } from '../Util/Event/mEmitter';
import { EventKey } from '../Util/Event/EventKey';

@ccclass('SoundController')
export class SoundController extends Component {

    @property([AudioClip])
    bgmList: AudioClip[] = [];

    @property([AudioClip])
    sfxList: AudioClip[] = [];

    @property
    bgmVolume: number = 1;

    @property
    sfxVolume: number = 1;

    private bgmSource: AudioSource | null = null;
    private sfxSource: AudioSource | null = null;

    private BGM_KEY = 'BGM_VOLUME';
    private SFX_KEY = 'SFX_VOLUME';

    onLoad() {
        this.init();
    }

    init() {
        if ((game as any).SOUND_CONTROLLER_EXIST) {
            this.node.destroy();
            return;
        }
        (game as any).SOUND_CONTROLLER_EXIST = true;

        this.bgmSource = this.node.addComponent(AudioSource);
        this.sfxSource = this.node.addComponent(AudioSource);

        this.bgmSource.loop = true;

        this.loadVolume();
        this.registerEvents();

        director.addPersistRootNode(this.node);

        // console.log('[SoundController] init', this.bgmVolume, this.sfxVolume);
    }

    loadVolume() {
        const bgm = parseFloat(sys.localStorage.getItem(this.BGM_KEY) || '1');
        const sfx = parseFloat(sys.localStorage.getItem(this.SFX_KEY) || '1');

        this.bgmVolume = bgm;
        this.sfxVolume = sfx;

        if (this.bgmSource) this.bgmSource.volume = bgm;
        if (this.sfxSource) this.sfxSource.volume = sfx;
    }

    registerEvents() {
        mEmitter.instance.on(EventKey.SOUND.ENABLE_BGM, this.onEnableBGM, this);
        mEmitter.instance.on(EventKey.SOUND.SET_BGM_VOLUME, this.setBGMVolume, this);
        mEmitter.instance.on(EventKey.SOUND.SET_SFX_VOLUME, this.setSFXVolume, this);
        mEmitter.instance.on(EventKey.SOUND.PLAY_SFX, this.playSFX, this);
        mEmitter.instance.on(EventKey.SOUND.PLAY_BGM, this.playBGM, this);
        mEmitter.instance.on(EventKey.SOUND.STOP_BGM, this.stopBGM, this);
        mEmitter.instance.on(EventKey.GAME.PREPARE_FOR_EXIT, this.onDestroySelf, this);
    }

    onDestroySelf() {
        director.removePersistRootNode(this.node);
        this.node.destroy();
    }

    onDestroy() {
        mEmitter.instance.off(EventKey.SOUND.ENABLE_BGM, this.onEnableBGM, this);
        mEmitter.instance.off(EventKey.SOUND.SET_BGM_VOLUME, this.setBGMVolume, this);
        mEmitter.instance.off(EventKey.SOUND.SET_SFX_VOLUME, this.setSFXVolume, this);
        mEmitter.instance.off(EventKey.SOUND.PLAY_SFX, this.playSFX, this);
        mEmitter.instance.off(EventKey.SOUND.PLAY_BGM, this.playBGM, this);
        mEmitter.instance.off(EventKey.SOUND.STOP_BGM, this.stopBGM, this);

        (game as any).SOUND_CONTROLLER_EXIST = false;
    }

    setBGMVolume(volume: number) {
        this.bgmVolume = volume;

        if (this.bgmSource) {
            this.bgmSource.volume = volume;
        }

        sys.localStorage.setItem(this.BGM_KEY, volume.toString());
    }

    onEnableBGM(isEnabled: boolean, bgmName: string) {
        if (isEnabled) {
            this.playBGM(bgmName);
        } else {
            this.stopBGM();
        }
    }

    playBGM(bgmName: string) {
        if (!this.bgmSource) return;

        const clip = this.bgmList.find(c => c.name === bgmName);
        if (!clip) {
            console.log('BGM not found:', bgmName);
            return;
        }

        this.bgmSource.stop();
        this.bgmSource.clip = clip;
        this.bgmSource.loop = true;
        this.bgmSource.play();
    }

    stopBGM() {
        if (this.bgmSource) {
            this.bgmSource.stop();
        }
    }

    setSFXVolume(volume: number) {
        this.sfxVolume = volume;

        if (this.sfxSource) {
            this.sfxSource.volume = volume;
        }

        sys.localStorage.setItem(this.SFX_KEY, volume.toString());
    }

    playSFX(sfxName: string) {
        if (!this.sfxSource) return;

        const clip = this.sfxList.find(c => c.name === sfxName);
        if (!clip) {
            console.log('SFX not found:', sfxName);
            return;
        }

        this.sfxSource.playOneShot(clip, this.sfxVolume);
    }
}