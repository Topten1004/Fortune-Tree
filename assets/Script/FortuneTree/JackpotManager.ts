const { ccclass, property } = cc._decorator;
import { Sound } from '../Common/Sound';
import { Common } from '../Common/Common';
import GameScene from './GameScene';
import { DataManager } from './DataManager';
import BtnTouchListener from '../Common/BtnTouchListener';

@ccclass
export default class JackpotManager extends cc.Component {
    mainScene: GameScene = null;
    @property(cc.Node)
    bgTip: cc.Node = null;
    @property(cc.Node)
    m_JackpotCoins: cc.Node[] = [];
    @property(cc.Node)
    m_JackpotIdles: cc.Node[] = [];
    @property(cc.Node)
    m_NodeResult: cc.Node = null;

    @property(cc.Button)
    m_btnHide: cc.Button = null;

    @property(cc.Node)
    tree: cc.Node = null;
    @property(sp.Skeleton)
    spTree: sp.Skeleton = null;

    @property(sp.Skeleton)
    treeFly: sp.Skeleton = null;
    @property(sp.Skeleton)
    ng2bg: sp.Skeleton = null;

    @property(cc.SpriteFrame)
    spf_Boards: cc.SpriteFrame[] = [];
    @property(cc.SpriteFrame)
    spf_Sticks: cc.SpriteFrame[] = [];
    @property(cc.SpriteFrame)
    spf_JackTypes: cc.SpriteFrame[] = [];

    @property(cc.AudioClip)
    audioBgBegin: cc.AudioClip = null;
    @property(cc.AudioClip)
    audioBgBgm: cc.AudioClip = null;
    @property(cc.AudioClip)
    audioBgEnd: cc.AudioClip = null;
    @property(cc.AudioClip)
    audioFgBgm: cc.AudioClip = null;
    @property(cc.AudioClip)
    audioTreeLongShake: cc.AudioClip = null;

    //Private Variables
    eleIndex = ['flip4', 'flip3', 'flip2', 'flip1'];
    jackpotIndex = ['Baby4', 'Baby3', 'Baby2', 'Baby1'];
    wordAnimIndex = ['Word4_EN', 'Word3_EN', 'Word2_EN', 'Word1_EN'];
    coinGlowIndex = ['glow4a', 'glow3a', 'glow2a', 'glow1a'];
    coinSelectedIndex = ['glow4b', 'glow3b', 'glow2b', 'glow1b'];

    coinsCenterOffsets = [
        new cc.Vec2(-257.5, -19.5), new cc.Vec2(-85.5, -58.5), new cc.Vec2(86.5, -58.5), new cc.Vec2(258.5, -19.5),
        new cc.Vec2(-257.5, -201.5), new cc.Vec2(-85.5, -240.5), new cc.Vec2(86.5, -240.5), new cc.Vec2(258.5, -201.5),
        new cc.Vec2(-262.5, -383.5), new cc.Vec2(-85.5, -422.5), new cc.Vec2(86.5, -422.5), new cc.Vec2(263.5, -383.5)
    ];

    jackpotClickedCount = [0, 0, 0, 0]; //mini, minor, major, grand
    clickingFinish = false;
    miniIDs = '';
    minorIDs = '';
    majorIDs = '';
    grandIDs = '';

    selectionResult = [];
    jackpotWin = 0;
    /////////////////////

    protected onEnable(): void {
    }

    perform() {
        // console.log('---Jackpot Node Performed---');
        this.node.active = true;
        this.node.stopAllActions();

        this.mainScene.m_BtnSpin.getComponent(BtnTouchListener).interactable = false;

        this.jackpotClickedCount = [0, 0, 0, 0];
        this.clickingFinish = false;
        this.miniIDs = '';
        this.minorIDs = '';
        this.majorIDs = '';
        this.grandIDs = '';

        this.m_JackpotCoins.forEach(coin => {
            // by jaison, need to uncomment
            // coin.getComponent(cc.Button).interactable = false;
            coin.getComponent(cc.Button).interactable = true;

            coin.active = false;

            coin.getChildByName('CoinGlow').active = false;
            coin.getChildByName('CoinFlip').active = true;
            coin.getChildByName('CoinFlip').getComponent(sp.Skeleton).setAnimation(0, 'Coin_idle_1', true);
            coin.getChildByName('JPBaby').active = false;
            coin.getChildByName('JPWord').active = false;
        });

        this.m_NodeResult.getChildByName('Mask').getComponent(cc.Animation).stop();
        this.m_NodeResult.getChildByName('Mask').getChildByName('Board').getComponent(cc.Sprite).spriteFrame = this.spf_Boards[0];
        this.m_NodeResult.getChildByName('Title').active = false;
        this.m_NodeResult.getChildByName('Price').active = false;
        this.m_NodeResult.getChildByName('Price').getComponent(cc.Label).string = '';
        this.m_NodeResult.getChildByName('Character').active = false;
        this.m_NodeResult.getChildByName('Character').getComponent(sp.Skeleton).setAnimation(0, 'Baby4', true);
        this.m_NodeResult.getChildByName('Left').getComponent(cc.Animation).stop();
        this.m_NodeResult.getChildByName('Left').getComponent(cc.Sprite).spriteFrame = this.spf_Sticks[0];
        this.m_NodeResult.getChildByName('Right').getComponent(cc.Animation).stop();
        this.m_NodeResult.getChildByName('Right').getComponent(cc.Sprite).spriteFrame = this.spf_Sticks[0];
        this.m_NodeResult.getChildByName('Jackpot_M').getComponent(sp.Skeleton).setAnimation(0, 'Grand_I', false);

        this.m_NodeResult.active = false;
        this.ng2bg.node.opacity = 255;
        this.m_btnHide.interactable = false;

        this.tree.active = true;
        this.spTree.node.active = true;
        this.spTree.setAnimation(0, 'open', false)
        this.spTree.addAnimation(0, 'idle8', true)

        for (let i = 0; i < this.m_JackpotCoins.length; i++) {
            this.m_JackpotCoins[i].setPosition(this.coinsCenterOffsets[i]);
        }

        this.mainScene.setMainBG(2);

        this.treeFly.node.active = true;
        this.treeFly.setAnimation(0, 'animation2', false);
        this.node.runAction(cc.sequence(cc.delayTime(1.2), cc.callFunc(function () {
            this.treeFly.node.active = false;
            this.m_JackpotCoins.forEach(coin => {
                coin.active = true;
            });
        }, this)));
    }

    public setMainScene(mainScene) {
        this.mainScene = mainScene;
    }

    public setSelectionResult(jackpotWin: number, result: string) {
        this.selectionResult = result.split('|');
        this.jackpotWin = jackpotWin;
    }

    public onJackpotCoin(event, customEventData, active) {
        if (this.clickingFinish) {
            return;
        }

        let self = this;
        Sound.getInstance().playEffect(Common.s_sound.AllButton, false, true)
        let clickedID = Number(customEventData);
        let jackpotID = Number(this.selectionResult.shift());

        this.m_JackpotCoins[clickedID].getComponent(cc.Button).interactable = false;
        this.m_JackpotCoins[clickedID].getChildByName('CoinFlip').getComponent(sp.Skeleton).setAnimation(0, this.eleIndex[jackpotID], false);

        this.m_JackpotCoins[clickedID].getChildByName('JPWord').active = true;
        this.m_JackpotCoins[clickedID].getChildByName('JPWord').getComponent(sp.Skeleton).setAnimation(0, this.wordAnimIndex[jackpotID], false);

        this.m_JackpotCoins[clickedID].getChildByName('CoinGlow').active = true;
        this.m_JackpotCoins[clickedID].getChildByName('CoinGlow').getComponent(sp.Skeleton).setAnimation(0, this.coinGlowIndex[jackpotID], true);

        this.jackpotClickedCount[jackpotID]++;
        switch (jackpotID) {
            case 0:
                this.miniIDs += clickedID + ',';
                break;
            case 1:
                this.minorIDs += clickedID + ',';
                break;
            case 2:
                this.majorIDs += clickedID + ',';
                break;
            case 3:
                this.grandIDs += clickedID + ',';
                break;
        }

        this.node.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(function () {
            self.m_JackpotIdles[clickedID].active = true;
            self.m_JackpotIdles[clickedID].getComponent(sp.Skeleton).setAnimation(0, self.jackpotIndex[jackpotID], true);
        }, this)))

        if (this.jackpotClickedCount[jackpotID] == 3) {
            let splitString;
            switch (jackpotID) {
                case 0:
                    splitString = this.miniIDs.split(',', 3);
                    break;
                case 1:
                    splitString = this.minorIDs.split(',', 3);
                    break;
                case 2:
                    splitString = this.majorIDs.split(',', 3);
                    break;
                case 3:
                    splitString = this.grandIDs.split(',', 3);
                    break;
            }

            this.m_JackpotCoins[splitString[0]].getChildByName('CoinGlow').getComponent(sp.Skeleton).setAnimation(0, this.coinSelectedIndex[jackpotID], true);
            this.m_JackpotCoins[splitString[1]].getChildByName('CoinGlow').getComponent(sp.Skeleton).setAnimation(0, this.coinSelectedIndex[jackpotID], true);
            this.m_JackpotCoins[splitString[2]].getChildByName('CoinGlow').getComponent(sp.Skeleton).setAnimation(0, this.coinSelectedIndex[jackpotID], true);

            this.clickingFinish = true;

            this.node.runAction(cc.sequence(cc.delayTime(3.5), cc.callFunc(function () {
                // console.log('ShowResultScreen intro', jackpotID);
                self.ShowResultScreen(jackpotID);
            }, this)))
        }
    }

    public ShowResultScreen(jackpotID) {
        // console.log('ShowResultScreen', jackpotID);

        let self = this;
        this.m_NodeResult.active = true;
        this.m_NodeResult.runAction(cc.sequence(cc.fadeTo(0, 255), cc.callFunc(function () { self.m_NodeResult.opacity = 255; })));
        this.m_NodeResult.getChildByName('Mask').getChildByName('Board').getComponent(cc.Sprite).spriteFrame = this.spf_Boards[jackpotID];
        this.m_NodeResult.getChildByName('Left').getComponent(cc.Sprite).spriteFrame = this.spf_Sticks[jackpotID];
        this.m_NodeResult.getChildByName('Right').getComponent(cc.Sprite).spriteFrame = this.spf_Sticks[jackpotID];
        this.m_NodeResult.getChildByName('Title').getComponent(cc.Sprite).spriteFrame = this.spf_JackTypes[jackpotID];
        this.m_NodeResult.getChildByName('Price').getComponent(cc.Label).string = Common.addComma2Digits(Number(this.jackpotWin));

        cc.audioEngine.stopAllEffects();
        cc.audioEngine.stopMusic();
        cc.audioEngine.playEffect(this.audioBgEnd, false);

        this.m_NodeResult.getChildByName('Mask').getComponent(cc.Animation).play();
        this.m_NodeResult.getChildByName('Left').getComponent(cc.Animation).play();
        this.m_NodeResult.getChildByName('Right').getComponent(cc.Animation).play();
        this.m_NodeResult.getChildByName('Jackpot_M').getComponent(sp.Skeleton).setAnimation(0, 'Grand_I', false);

        this.node.runAction(cc.sequence(cc.delayTime(0.35), cc.callFunc(function () {
            self.m_NodeResult.getChildByName('Title').active = true;
            self.m_NodeResult.getChildByName('Price').active = true;
            self.m_NodeResult.getChildByName('Character').active = true;
            self.m_NodeResult.getChildByName('Character').getComponent(sp.Skeleton).setAnimation(0, self.jackpotIndex[jackpotID], true);
        }, this)));

        self.m_NodeResult.getChildByName('Jackpot_M').getComponent(sp.Skeleton).setAnimation(0, 'Grand_L', true);

        this.node.runAction(cc.sequence(cc.delayTime(3.5), cc.callFunc(function () {
            if (self.m_btnHide.interactable)
                self.hideManager();
        }, this)));
        this.node.runAction(cc.sequence(cc.delayTime(2), cc.callFunc(function () {
            self.m_btnHide.interactable = true;
        }, this)));
    }

    public hideManager() {
        this.m_btnHide.interactable = false;
        let self = this;

        DataManager.getInstance().jackpots = {};

        this.m_NodeResult.runAction(cc.sequence(cc.fadeTo(1, 0), cc.callFunc(function () { self.m_NodeResult.opacity = 0; })));

        self.spTree.setAnimation(0, 'change8', false);

        self.spTree.addAnimation(0, 'idle4', true);

        self.ng2bg.node.runAction(cc.fadeOut(0.5));

        this.node.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(function () {
            if (DataManager.getInstance().free && DataManager.getInstance().nextFree > 0) {
                cc.audioEngine.stopMusic();
                cc.audioEngine.playMusic(self.audioFgBgm, true);
                // cc.audioEngine.setMusicVolume(1);
            }

            self.mainScene.m_BtnSpin.getComponent(BtnTouchListener).interactable = true;

            if (DataManager.getInstance().free) {
                self.mainScene.onSpin();
                self.mainScene.setMainBG(1, 2);
            } else {
                self.mainScene.setMainBG(0, 2);
            }

            if (DataManager.getInstance().auto && DataManager.getInstance().autoNum > 0) {
                self.mainScene.onSpin();
            }

            self.mainScene.result.stopEleAct();
            self.mainScene.result.addingCoin = 1;
            self.mainScene.result.node.active = true;
            self.mainScene.m_NumWin.node.active = true;
            DataManager.getInstance().winMoney = Number(self.jackpotWin);
            self.mainScene.result.setScore(true);
            DataManager.getInstance().status = Common.eStatus.Win;

            self.node.active = false;
        }, this)));
    }
}
