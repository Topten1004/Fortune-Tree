const { ccclass, property } = cc._decorator;

import { Common } from "../Common/Common";
import { Sound } from "../Common/Sound";
import { DataManager } from "./DataManager";

@ccclass
export default class Bigwin extends cc.Component {

    @property(cc.Prefab)
    coin_prefab: cc.Prefab = null;

    @property(cc.Node)
    coin_parent_node: cc.Node = null;

    @property(cc.Label)
    bigwin_Amount: cc.Label = null;

    @property(sp.Skeleton)
    bigWin_anims: sp.Skeleton[] = [];

    coinAnimName = ["Coin_flip_center", "Coin_flip_Left", "Coin_flip_right"];

    @property(cc.AudioClip)
    bigWin_sound: cc.AudioClip[] = [];

    @property(cc.AudioClip)
    bigwin_back_sound: cc.AudioClip = null;

    @property(cc.AudioClip)
    bigwin_end_sound: cc.AudioClip = null;

    callbackFinishedBigwin: Function = null;

    soundId: number;
    backSoundId: number;

    lastBigWinIndex = 0;

    private coinSkels_center: sp.Skeleton[] = [];
    private coinSkels_left: sp.Skeleton[] = [];
    private coinSkels_right: sp.Skeleton[] = [];

    show(bigWinIndex: number, amount: number, callback: Function = undefined) {
        this.node.active = true;
        this.lastBigWinIndex = bigWinIndex;
        this.bigWin_anims[bigWinIndex].node.active = true;

        this.bigwin_Amount.string = Common.addComma2Digits(amount);

        this.callbackFinishedBigwin = callback;

        //act for coin fly
        for (let i = 0; i < 10; i++) {
            //center
            const coinObj = cc.instantiate(this.coin_prefab);
            const coinSkel = coinObj.getComponent(sp.Skeleton);

            //left
            const coinObj1 = cc.instantiate(this.coin_prefab);
            const coinSkel1 = coinObj1.getComponent(sp.Skeleton);

            //right
            const coinObj2 = cc.instantiate(this.coin_prefab);
            const coinSkel2 = coinObj2.getComponent(sp.Skeleton);

            this.coinSkels_center[i] = coinSkel;
            this.coinSkels_left[i] = coinSkel1;
            this.coinSkels_right[i] = coinSkel2;

            let xPos = Common.randomNumber(-30, 30);
            let yPos = Common.randomNumber(-30, 30);
            this.coinSkels_center[i].node.position = new cc.Vec3(xPos, yPos);
            this.coinSkels_left[i].node.position = new cc.Vec3(xPos, yPos);
            this.coinSkels_right[i].node.position = new cc.Vec3(xPos, yPos);

            this.coin_parent_node.addChild(this.coinSkels_center[i].node, 0, "coin");
            this.coin_parent_node.addChild(this.coinSkels_left[i].node, 0, "coin");
            this.coin_parent_node.addChild(this.coinSkels_right[i].node, 0, "coin");

            cc.tween(this.coinSkels_center[i].node).delay(0.8 * i).call(() => {
                this.coinSkels_center[i].loop = true;
                this.coinSkels_center[i].animation = this.coinAnimName[0];
            }).start();

            cc.tween(this.coinSkels_left[i].node).delay(0.8 * i + 0.2).call(() => {
                this.coinSkels_left[i].loop = true;
                this.coinSkels_left[i].animation = this.coinAnimName[1];
            }).start();

            cc.tween(this.coinSkels_right[i].node).delay(0.8 * i + 0.4).call(() => {
                this.coinSkels_right[i].loop = true;
                this.coinSkels_right[i].animation = this.coinAnimName[2];
            }).start();
        }

        this.bigWin_anims[bigWinIndex].loop = true;
        this.bigWin_anims[bigWinIndex].animation = "intro";
        cc.tween(this.bigWin_anims[bigWinIndex].node).delay(0.8).call(() => {
            this.bigWin_anims[bigWinIndex].animation = "idle";
        }).start();

        if (this.soundId != null) {
            cc.audioEngine.stopEffect(this.soundId);
            this.soundId = null;
        }

        if (this.backSoundId != null) {
            cc.audioEngine.stopMusic();
            this.backSoundId = null;
        }

        let self = this;
        setTimeout(() => {
            self.soundId = cc.audioEngine.playEffect(self.bigWin_sound[bigWinIndex], false);
        }, 300);

        this.backSoundId = cc.audioEngine.playMusic(this.bigwin_back_sound, false);
    }

    smallShow() {
    }

    hide() {
        let self = this;

        setTimeout(() => {
            if (self.backSoundId != null) {
                cc.audioEngine.playEffect(self.bigwin_end_sound, false);
            }
        }, 100);

        setTimeout(() => {
            self.bigWin_anims[self.lastBigWinIndex].animation = '';

            //removed by Petar 2022.09.15
            this.coin_parent_node.removeAllChildren(true);

            self.bigWin_anims[self.lastBigWinIndex].node.active = false;
            self.node.active = false;
            if (self.soundId != null) {
                cc.audioEngine.stopEffect(self.soundId);
                self.soundId = null;
            }

            if (self.backSoundId != null) {
                cc.audioEngine.stopMusic();
                self.backSoundId = null;

                //should play main background music
                if (DataManager.getInstance().free) {
                    Sound.getInstance().playBGMusic(Common.s_sound.FreeBG, true);
                }
                else {
                    Sound.getInstance().playBGMusic(Common.s_sound.MainBG, true);
                }
            }

            if (this.callbackFinishedBigwin) {
                this.callbackFinishedBigwin();
            }
        }, 400);
    }

    stop() {
        this.hide();
    }
}
