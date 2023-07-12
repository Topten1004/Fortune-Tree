import { Common } from "../Common/Common";
import { Sound } from "../Common/Sound";
import { DataManager } from "./DataManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FreeEnd extends cc.Component {

    @property(cc.Label)
    lbl_freeSpinWin: cc.Label = null;

    @property(cc.Button)
    btn_continue: cc.Button = null;

    @property(cc.AudioClip)
    audio_winEnd: cc.AudioClip = null;
    @property(cc.AudioClip)
    audio_fgEnd: cc.AudioClip = null;

    callback?: () => void;

    start() {

    }

    public show(winmoney: number, callback?: () => void) {
        var self = this;
        this.lbl_freeSpinWin.string = '0';
        this.node.active = true;
        this.node.opacity = 255;

        this.callback = callback;

        cc.tween(this.node).delay(0.5).call(() => {
            self.lbl_freeSpinWin.string = Common.addComma2Digits(winmoney);
            self.btn_continue.node.active = true;
        }).delay(2).call(() => {
            if (DataManager.getInstance().auto == true)
                this.onContinue();
        }).start();

        cc.audioEngine.playEffect(this.audio_winEnd, false);
        cc.audioEngine.playEffect(this.audio_fgEnd, false);
    }
    public hide() {
        this.node.runAction(cc.sequence(cc.fadeOut(0.5), cc.callFunc(() => { this.node.active = false }, this)));
    }

    onContinue() {
        cc.tween(this.node).delay(0.3).call(() => {
            this.callback();
            this.hide();
        }).start();
    }
}
