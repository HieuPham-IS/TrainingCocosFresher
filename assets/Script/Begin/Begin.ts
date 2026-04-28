import { _decorator, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;
import { mEmitter } from '../Util/Event/mEmitter';
import { EventKey } from '../Util/Event/EventKey';

@ccclass('Begin')
export class Begin extends Component {
    onClickStart(): void {
        mEmitter.instance.emit(EventKey.SCENE.LOAD_LOBBY);

        director.preloadScene("Loading", function () {
            console.log('Next scene preloaded');
        });

        director.loadScene('Loading');
    }
}

