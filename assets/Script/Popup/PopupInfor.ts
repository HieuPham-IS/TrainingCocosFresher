import { _decorator, Component, Node, Label, sys, Button } from 'cc';
import { mEmitter } from '../Util/Event/mEmitter';
import { EventKey } from '../Util/Event/EventKey';
const { ccclass, property } = _decorator;

@ccclass('PopupInfor')
export class PopupInfor extends Component {
    @property(Label)
    lvLabel: Label | null = null;

    @property(Label)
    hpLabel: Label | null = null;

    @property(Label)
    damageLabel: Label | null = null;

    @property(Label)
    goldCostLabel: Label | null = null;

    @property(Button)
    upgradeButton: Button | null = null;

    private currentLevel: number = 1;
    private upgradeCost: number = 0;

    onDestroy() {
        mEmitter.instance.off('UPDATE_GOLD', this.updateTotalGold, this);
    }

    onEnable() {
        this.registerEvents();
        this.currentLevel = Number(sys.localStorage.getItem('playerLevel') || 1);
        this.updateUI();
    }

    registerEvents() {
        mEmitter.instance.on('UPDATE_GOLD', this.updateTotalGold, this);
    }

    updateTotalGold() {
        this.updateUI();
    }

    updateUI() {
        const hp = Math.floor(150 * Math.pow(1.15, this.currentLevel - 1));
        const damage = Math.floor(50 * Math.pow(1.15, this.currentLevel - 1));
        this.upgradeCost = Math.floor(100 * Math.pow(1.5, this.currentLevel - 1));

        if (this.lvLabel) this.lvLabel.string = `${this.currentLevel}`;
        if (this.hpLabel) this.hpLabel.string = `${hp}`;
        if (this.damageLabel) this.damageLabel.string = `${damage}`;
        if (this.goldCostLabel) this.goldCostLabel.string = `${this.upgradeCost}`;
    }

    onPressUpgrade() {
        mEmitter.instance.emit(EventKey.SOUND.PLAY_SFX, "click");

        let totalGold = Number(sys.localStorage.getItem('totalGold') || 0);
        if (totalGold >= this.upgradeCost) {
            totalGold -= this.upgradeCost;
            sys.localStorage.setItem('totalGold', totalGold.toString());

            this.currentLevel++;
            sys.localStorage.setItem('playerLevel', this.currentLevel.toString());

            this.updateUI();
            mEmitter.instance.emit('UPDATE_GOLD');
        } else {
            console.log("Not enough gold!");
        }
    }

    onPressBack() {
        mEmitter.instance.emit(EventKey.SOUND.PLAY_SFX, "click");
        mEmitter.instance.emit(EventKey.POPUP.HIDE);
    }
}

