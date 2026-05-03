import { _decorator, Component, director, AudioClip, AudioSource } from 'cc';
const { ccclass, property } = _decorator;
import { mEmitter } from '../Util/Event/mEmitter';
import { EventKey } from '../Util/Event/EventKey';

@ccclass('Begin')
export class Begin extends Component {

    @property({ type: AudioClip })
    clickSfx: AudioClip | null = null;

    onClickStart(): void {
        if (this.clickSfx) {
            const source = this.node.getComponent(AudioSource) || this.node.addComponent(AudioSource);
            source.playOneShot(this.clickSfx);
        }

        mEmitter.instance.emit(EventKey.SCENE.LOAD_LOBBY);

        director.preloadScene("Loading", function () {
            console.log('Next scene preloaded');
        });

        director.loadScene('Loading');
    }
}
