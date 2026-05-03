import { _decorator, Component, Label, sys } from 'cc';
import { mEmitter } from '../Util/Event/mEmitter';
import { EventKey } from '../Util/Event/EventKey';
const { ccclass, property } = _decorator;

@ccclass('PopupResult')
export class PopupResult extends Component {
    @property(Label)
    scoreLabel: Label | null = null;

    @property(Label)
    goldLabel: Label | null = null;

    @property(Label)
    highScoreLabel: Label | null = null;

    onLoad() {
        mEmitter.instance.on(EventKey.ROOM.UPDATE_RESULT, this.onUpdateResult, this);
    }

    onDestroy() {
        mEmitter.instance.off(EventKey.ROOM.UPDATE_RESULT, this.onUpdateResult, this);
    }

    onUpdateResult(data: { score: number, gold: number }) {
        let highScore = Number(sys.localStorage.getItem('highScore') || 0);
        if (data.score > highScore) {
            highScore = data.score;
            sys.localStorage.setItem('highScore', highScore.toString());
        }

        if (this.highScoreLabel) this.highScoreLabel.string = `${highScore}`;
        if (this.scoreLabel) this.scoreLabel.string = `${data.score}`;
        if (this.goldLabel) this.goldLabel.string = `${data.gold}`;
    }

    onPressAgain() {
        mEmitter.instance.emit(EventKey.SOUND.PLAY_SFX, "click");
        mEmitter.instance.emit(EventKey.POPUP.HIDE);
        mEmitter.instance.emit(EventKey.ROOM.RESET);
    }

    onPressBack() {
        mEmitter.instance.emit(EventKey.SOUND.PLAY_SFX, "click");
        mEmitter.instance.emit(EventKey.POPUP.HIDE);
        mEmitter.instance.emit(EventKey.ROOM.EXIT);
    }
}
