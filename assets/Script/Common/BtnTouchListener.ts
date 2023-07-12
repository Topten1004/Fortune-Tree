import { DataManager } from "../FortuneTree/DataManager";
import GameScene from "../FortuneTree/GameScene";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BtnTouchListener extends cc.Component {
    @property(GameScene)
    m_MainScene: GameScene = null;

    @property(cc.Sprite)
    m_BtnSprite: cc.Sprite = null;

    @property(cc.SpriteFrame)
    pressedFrame: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    normalFrame: cc.SpriteFrame = null;

    touchStarted: boolean = false;
    touchStartTime: Date = null;

    interactable: boolean = true;

    onLoad() {
        let self = this;
        this.node.on('touchstart', function () {
            if (!self.interactable) return;

            // Touch start  
            self.touchStarted = true;
            // Record the touch start time 
            self.touchStartTime = new Date();

            self.m_BtnSprite.spriteFrame = self.pressedFrame;
        }, this);

        this.node.on('touchmove', function (event) {
        }, this);

        this.node.on('touchcancel', function (event) {
            self.touchStarted = false;
        }, this);

        this.node.on('touchend', function () {
            if (self.touchStarted) {
                self.touchStarted = false;
                self.m_MainScene.onSpin();
            }
        }, this);
    }

    update(dt: number): void {
        if (!this.touchStarted) return;

        let deltaTime = ((new Date()).getTime() - this.touchStartTime.getTime()) / 1000;
        this.m_BtnSprite.spriteFrame = this.normalFrame;

        if (deltaTime > 0.7) {
            this.touchStarted = false;

            if (DataManager.getInstance().free && DataManager.getInstance().nextFree > 0) return;

            this.m_MainScene.onAutoPlay();
        }
    }
}
