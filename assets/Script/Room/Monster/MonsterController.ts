import { _decorator, Component, Game, Node, Prefab } from 'cc';
const { ccclass, property } = _decorator;
import { mEmitter } from '../../Util/Event/mEmitter';
import { EventKey } from '../../Util/Event/EventKey';
import { GameAsset } from '../../Util/GameAsset';
import { gameConfig } from '../../Util/GameConfig';

@ccclass('MonsterController')
export class MonsterController extends Component {
    @property(Prefab)
    monsterPrefab: Prefab | null = null;

    @property(GameAsset)
    gameAsset: GameAsset | null = null;

    start() {

    }


}

