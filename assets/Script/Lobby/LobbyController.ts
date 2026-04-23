import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
import { mEmitter } from '../Util/Event/mEmitter';
import { EventKey } from '../Util/Event/EventKey';

@ccclass('LobbyController')
export class LobbyController extends Component {
    onClickStart(): void {
        mEmitter.instance.emit(EventKey.SCENE.LOAD_ROOM);
    }
}

