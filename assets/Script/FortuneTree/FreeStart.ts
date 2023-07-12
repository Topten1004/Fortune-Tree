const { ccclass, property } = cc._decorator;

import BtnTouchListener from "../Common/BtnTouchListener";
import { Common } from "../Common/Common";
import { Sound } from "../Common/Sound";
import { DataManager } from "./DataManager";
import GameScene from "./GameScene";
import { NetTrans } from "./NetTrans";

@ccclass
export default class FreeStart extends cc.Component {
    @property(cc.Label)
    label_timer: cc.Label = null;

    @property(cc.Button)
    buttons: cc.Button[] = [];

    mainScene: GameScene = null;

    isSelected = false;

    public setMainScene(mainScene) {
        this.mainScene = mainScene;
    }

    public show() {
        var self = this;
        this.node.active = true;
        self.node.getChildByName("FreeSpinPanel").getComponent(sp.Skeleton).setAnimation(0, "intor_EN", false);
        self.node.getChildByName("FreeSpinPanel").getComponent(sp.Skeleton).addAnimation(0, "loop_EN", true);
        this.label_timer.node.active = false;
        this.isSelected = false;

        setTimeout(() => {
            self.mainScene.setMainBG(1);

            self.buttons.forEach(button => {
                button.interactable = true;
            });
        }, 1000);

        setTimeout(() => {
            if (!self.isSelected) {
                self.label_timer.node.active = true;

                self.count(6);
            }
        }, 20000);

        // added by jaison to reset autospin when entering freespin
        DataManager.getInstance().auto = false;
        DataManager.getInstance().autoNum = 0;
        this.mainScene.m_NumMessage.string = '';
        this.mainScene.m_BtnSpin.active = true;
        this.mainScene.m_BtnStop.node.active = false;
        this.mainScene.m_BtnAutoStop.node.active = false;
        this.mainScene.checkStatus();
    }

    public count(time) {
        var self = this;
        var setTime = time - 1;

        if (!this.isSelected) {
            if (setTime > 0) {
                // console.log("time left : " + setTime);
                self.label_timer.string = "Auto Pick in " + setTime + " Seconds";

                this.scheduleOnce(function () { this.count(setTime) }, 1);
            }
            else {
                self.label_timer.node.active = false;
                this.scheduleOnce(function () { this.spinSelect(null, 0) }, 1);
            }
        }
    }

    public spinSelect(event, customEventData, actived) {
        let freespinNum = Number(customEventData);
        var self = this;
        this.isSelected = true;

        NetTrans.sendSelectedDragon(freespinNum);

        DataManager.getInstance().freeType = freespinNum;
        DataManager.getInstance().free = true;

        Sound.getInstance().playEffect(Common.s_sound.FGPick, false, true);
        setTimeout(() => {
            switch (freespinNum) {
                case 0://88
                    self.node.getChildByName("FreeSpinPanel").getComponent(sp.Skeleton).setAnimation(0, "dianji88_EN", false);
                    break;
                case 1://98
                    self.node.getChildByName("FreeSpinPanel").getComponent(sp.Skeleton).setAnimation(0, "dianji98_EN", false);
                    break;
                case 2://108
                    self.node.getChildByName("FreeSpinPanel").getComponent(sp.Skeleton).setAnimation(0, "dianji108_EN", false);
                    break;
                case 3://118
                    self.node.getChildByName("FreeSpinPanel").getComponent(sp.Skeleton).setAnimation(0, "dianji118_EN", false);
                    break;
                case 4://128
                    self.node.getChildByName("FreeSpinPanel").getComponent(sp.Skeleton).setAnimation(0, "dianji128_EN", false);
                    break;
            }
        }, 200);

        setTimeout(() => {
            self.node.active = false;
        }, 5500);

        this.buttons.forEach(button => {
            button.interactable = false;
        });

        this.mainScene.m_BtnSpin.getComponent(BtnTouchListener).interactable = true;
    }
}
