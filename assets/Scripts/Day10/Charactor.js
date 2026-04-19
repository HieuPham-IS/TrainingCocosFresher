cc.Class({
    extends: cc.Component,

    properties: {
        speed: 100,
        spine: sp.Skeleton,
        nameLabel: cc.Label,
        manaBar: cc.ProgressBar,
        btnLeft: cc.Node,
        btnRight: cc.Node,
        charName: "",
    },

    onLoad () {
        console.log(this.manaBar);
        this.setName();
        this.move = 0;
        this.manaBar.progress = 1;

        this.btnLeft.on('touchstart', this.moveLeft, this);
        this.btnLeft.on('touchend', this.onStop, this);
        this.btnLeft.on('touchcancel', this.onStop, this);

        this.btnRight.on('touchstart', this.moveRight, this);
        this.btnRight.on('touchend', this.onStop, this);
        this.btnRight.on('touchcancel', this.onStop, this);

    },

    moveLeft() {
        this.move = -1;
    },

    moveRight() {
        this.move = 1;
    },

    onStop() {
        this.move = 0;
    },

    update (dt) {
        if (this.manaBar.progress <= 0) {
            this.die();
            return;
        }
        if (this.move !== 0) {

            let speed = this.speed;

            if (this.manaBar.progress < 0.5) {
                speed = this.speed * this.manaBar.progress;
            }

            this.node.x += this.move * speed * dt;

            if (this.move > 0) {
                this.spine.node.scaleX = Math.abs(this.spine.node.scaleX);
            } else {
                this.spine.node.scaleX = -Math.abs(this.spine.node.scaleX);
            }

            this.manaBar.progress -= 0.1 * dt;
            this.manaBar.progress = Math.max(0, this.manaBar.progress);

        } else if(this.move === 0){
            this.manaBar.progress += 0.2 * dt;
            this.manaBar.progress = Math.min(1, this.manaBar.progress);
        }
    },

    setName() {
        this.nameLabel.string = this.charName;
    },

    die() {
        this.move = 0;
        this.node.active = false;
    }
});