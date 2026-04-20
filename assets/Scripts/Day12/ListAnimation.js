cc.Class({
    extends: cc.Component,

    properties: {
        spine: sp.Skeleton,
        content: cc.Node,
        prefab: cc.Prefab,

        uiNodes: {
            default: [],
            type: [cc.Node],
        }
    },

    onLoad() {

        for (let i = 0; i < this.uiNodes.length; i++) {
            let n = this.uiNodes[i];
            if (n) {
                n.active = false;
            }
        }

        if (!this.content) {
            return;
        }

        this.content.removeAllChildren();

        let anims = this.spine.skeletonData.getRuntimeData().animations;

        for (let i = 0; i < anims.length; i++) {
            let item = cc.instantiate(this.prefab);

            let animScript = item.getComponent("animItem");
            if (!animScript) {
                animScript = item.addComponent("animItem");
            }

            animScript.init(anims[i].name);
            this.content.addChild(item);
        }
    },

    toggleUI() {
        for (let i = 0; i < this.uiNodes.length; i++) {
            let n = this.uiNodes[i];
            if (n) {
                n.active = !n.active;
            }
        }
    }
});
