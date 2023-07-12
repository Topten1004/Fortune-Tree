import { DataManager } from "./DataManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MoreFree extends cc.Component {

    @property(cc.Button)
    btn_continue: cc.Button = null;

    callback?: () => void;

    public show(frespinNum: number, callback?: () => void) {
        var self = this;
        this.node.active = true;
        this.callback = callback;

        cc.tween(this.node).delay(0.5).call(() => {
            self.btn_continue.node.active = true;
        }).delay(2).call(() => {
            this.onContinue();
        }).start();
    }
    public hide() {
        this.node.active = false;
    }

    onContinue() {
        this.hide();
        this.callback();
    }
}
