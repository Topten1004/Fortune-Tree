// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Common } from "../Common/Common";
import { DataManager } from "./DataManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Symbol extends cc.Component {

    @property(cc.Sprite)
    ele_bg: cc.Sprite = null

    @property(cc.SpriteFrame)
    icons: cc.SpriteFrame[] = [];

    @property(cc.SpriteFrame)
    blur_icons: cc.SpriteFrame[] = [];

    @property(sp.Skeleton)
    wild_anim: sp.Skeleton = null;

    @property(sp.Skeleton)
    scatter_anim: sp.Skeleton = null;

    symbolIndex: number = 0;

    public init(symbolIndex: number): void {
        this.symbolIndex = symbolIndex;
        this.ele_bg.spriteFrame = this.icons[this.symbolIndex];
        this.wild_anim.node.active = false;
        this.scatter_anim.node.active = false;
    }

    public resetItem(symbolIndex: number): void {
        this.symbolIndex = symbolIndex;
        this.ele_bg.spriteFrame = this.icons[this.symbolIndex];
        this.wild_anim.node.active = false;
        this.scatter_anim.node.active = false;
    }

    public runAnimation(isloop: boolean, isBlur: boolean = true): void {
        if (this.symbolIndex === Common.wildSymbol) {
            this.wild_anim.node.active = true;
            this.wild_anim.setAnimation(0, "Wild_L", false);
        } else if (this.symbolIndex === Common.scatterSymbol) {
            this.scatter_anim.node.active = true;
            this.scatter_anim.setAnimation(0, "Scatter_L", false);
        } else {
            this.ele_bg.node.runAction(cc.repeatForever(
                cc.sequence(
                    cc.hide(),
                    cc.delayTime(0.3),
                    cc.show(),
                    cc.delayTime(0.3),
                )
            ));
        }
    }

    public stopAnimation(isBlur: boolean = false): void {
        this.wild_anim.node.active = false;
        this.scatter_anim.node.active = false;
        this.ele_bg.node.stopAllActions();
        this.ele_bg.node.active = true;
        this.ele_bg.node.opacity = 255;
    }
}