const { ccclass, property } = cc._decorator;
import { Sound } from "../Common/Sound";
import { Common } from "../Common/Common";
import { DataManager } from "./DataManager";
import GameScene from "./GameScene";
@ccclass
export default class AutoSpinSetting extends cc.Component {
    mainScene: GameScene = null;
    onLoad() {

    }
    start() {

    }
    public onBtnAuto(event, customEventData, active) {
        Sound.getInstance().playEffect(Common.s_sound.AllButton, false, true)
        let clickedID = Number(customEventData)
        let autonums = [20, 50, 100, 500, 1000000, 10000001]
        DataManager.getInstance().autoNum = autonums[clickedID];
        this.node.active = false
        this.mainScene.onEventAutoPlay()
    }

    public setMainScene(mainScene) {
        this.mainScene = mainScene;
    }

    public onHideAutoPanel() {
        if (this.node.active == true) {
            this.node.active = false;
        }
    }
}
