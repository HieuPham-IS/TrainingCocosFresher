import { _decorator, Component, director, Label, Node, ProgressBar, sp, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LoadingCotroller')
export class LoadingCotroller extends Component {
    @property(ProgressBar)
    loadingBar: ProgressBar | null = null;

    @property(Label)
    loadingLabel: Label | null = null;

    @property(sp.Skeleton)
    spineSkeleton: sp.Skeleton | null = null;

    private doStates: string[] = [];

    private currentDotStateIndex: number = 0;

    protected onLoad(): void {
        this.loadingScene();
        this.onProcessStart();

    }

    onProcessStart(): void {
        this.doStates = ["Loading", "Loading.", "Loading..", "Loading..."];
        this.currentDotStateIndex = 0;

        this.loadingBar.progress = 0;
        this.loadingLabel.string = `${this.doStates[this.currentDotStateIndex]} 0%`;
        this.spineSkeleton.setAnimation(0, 'run', true);
    }

    onProcessUpdate(process: number): void {
        this.loadingBar.progress = process > this.loadingBar.progress ? process : this.loadingBar.progress;

        const width = this.loadingBar.totalLength;
        this.spineSkeleton.node.setPosition(new Vec3(width * this.loadingBar.progress, 20, 0));

        let loadingPrefix = this.doStates[this.currentDotStateIndex];
        this.loadingLabel.string = `${loadingPrefix} ${Math.floor(process * 100)}%`;

        this.currentDotStateIndex = (this.currentDotStateIndex + 1) % this.doStates.length;
    }

    loadingScene(): void {
        director.preloadScene('Lobby', (completedCount: number, totalCount: number) => {
            let process = totalCount > 0 ? completedCount / totalCount : 0;
            this.onProcessUpdate(process);
        },
            () => {
                director.loadScene('Lobby');
            }
        )
    }


}


