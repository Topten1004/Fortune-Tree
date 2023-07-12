// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Language from "./Language";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MultiLabel extends cc.Component {

    @property
    key: string = '';

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        let label = this.getComponent(cc.Label);
        if (label) {
            label.string = Language.getInstance().getString(this.key);
            return;
        } 
    }

    start () {

    }

    // update (dt) {}
}
