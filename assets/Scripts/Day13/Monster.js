cc.Class({
    extends: cc.Component,

    properties: {

    },

    // onLoad () {},

    start() {

    },

    onCollisionEnter: function (other, self) {
        console.log('on collision enter');
    },

    // onCollisionStay: function (other, self) {
    //     console.log('on collision stay');
    // },

    onCollisionExit: function (other, self) {
        console.log('on collision exit');
    }
    // update (dt) {},
});
