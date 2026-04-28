import { _decorator, Component, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Round')
export class Round extends Component {

    @property({ type: Number })
    public wave: number = 0;

    @property(Label)
    public titleWave: Label | null = null;


    public init(wave: number): void {
        this.wave = wave;
        this.renderTitle();
    }

    public updateTitleWave(wave: number): void {
        this.wave = wave;
        this.renderTitle();
    }

    private renderTitle(): void {
        if (this.titleWave) {
            this.titleWave.string = `Round ${this.wave}`;
        } else {
            console.warn("Round Component: Label 'titleWave' chưa được gán trong Inspector!");
        }
    }
}