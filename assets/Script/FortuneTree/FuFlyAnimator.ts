import { Common } from "../Common/Common";
import { Sound } from "../Common/Sound";
import GameScene from "./GameScene";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    startingPos: cc.Vec2;

    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        let self = this;

        //FuFly node is activate
        this.node.setPosition(this.startingPos);


        Sound.getInstance().playEffect(Common.s_sound.FuFly_Pick, false, true);
        cc.tween(this.node).to(1.5, { position: cc.v3(320, 550) }).call(() => {

        }).delay(0.3).call(() => {
            self.node.active = false;

            //call GameScene function for tree animation
            cc.find("Canvas/GameScene").getComponent(GameScene).setTreeAnimation();

        }).delay(3).call(() => {
            self.node.destroy();
        }).start();
    }

    start() {

    }

    // update (dt) {}
}
