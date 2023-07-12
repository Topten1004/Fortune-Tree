import { Common } from "../Common/Common";
import GlobalData from "../Common/GlobalData";
import { Sound } from "../Common/Sound";
import AutoSpinSetting from "./AutoSpinSetting";
import Bigwin from "./Bigwin";
import { DataManager } from "./DataManager";
import FreeEnd from "./FreeEnd";
import FreeStart from "./FreeStart";
import { NetTrans } from "./NetTrans";
import Result from "./Result";
import RollMgr from "./RollMgr";
import { TestGetResult } from "./TestGetResult";
import MoreFree from "./MoreFree";
import NodeDialog from "../Common/NodeDialog";
import HttpClient from "../Network/HttpClient";
import JackpotManager from "./JackpotManager";
import JackpotLayer from "./JackpotLayer";
import Language from "../Language/Language";

const { ccclass, property } = cc._decorator;
@ccclass
export default class GameScene extends cc.Component {
    @property(cc.Camera)
    camera: cc.Camera = null;
    @property(cc.Mask)
    bgMasks: cc.Mask[] = [];
    @property(cc.Node)
    nodeHeader: cc.Node = null;
    @property(cc.Node)
    nodeFooter: cc.Node = null;

    //Panels---------------------------------
    @property(cc.Node)
    m_NodeNormal: cc.Node = null;
    @property(cc.SpriteFrame)
    spf_backImages: cc.SpriteFrame[] = [];
    @property(cc.Node)
    m_NodeHelp: cc.Node = null;
    @property(AutoSpinSetting)
    autoPlaySetting: AutoSpinSetting = null;
    @property(FreeStart)
    m_FreeStart: FreeStart = null;
    @property(MoreFree)
    m_MoreFree: MoreFree = null;
    @property(FreeEnd)
    m_FreeEnd: FreeEnd = null;
    @property(Bigwin)
    m_BigWinNode: Bigwin = null;
    @property(RollMgr)
    rollMgr: RollMgr = null;
    @property(Result)
    result: Result = null;
    @property(NodeDialog)
    m_dialog: NodeDialog = null;
    @property(JackpotManager)
    jackpotManager: JackpotManager = null;
    @property(JackpotLayer)
    jackpotLayer: JackpotLayer = null;
    //-----------------------------------------

    //Buttons--------------------------------
    @property(cc.Button)
    m_BtnHelp: cc.Button = null;
    @property(cc.Button)
    m_BtnAutoPlay: cc.Button = null
    @property(cc.Button)
    m_BtnAutoStop: cc.Button = null;
    @property(cc.Node)
    m_BtnSpin: cc.Node = null;
    @property(cc.Button)
    m_BtnStop: cc.Button = null;
    @property(cc.Button)
    m_BtnStopDisable: cc.Button = null;

    @property(cc.Button)
    m_BtnBetUp: cc.Button = null;
    @property(cc.Button)
    m_BtnBetDown: cc.Button = null;
    @property(cc.Button)
    m_BtnBetMax: cc.Button = null;
    @property(cc.Button)
    m_BtnHome: cc.Button = null;
    @property(cc.Button)
    m_BtnFullScreenOn: cc.Button = null;
    @property(cc.Button)
    m_BtnFullScreenOff: cc.Button = null;

    @property(cc.Button)
    m_BtnSoundOn: cc.Button = null;
    @property(cc.Button)
    m_BtnSoundOff: cc.Button = null;
    //-----------------------------------------

    //Texts------------------------------------
    @property(cc.Label)
    m_NumTotalBet: cc.Label = null;
    @property(cc.Label)
    m_NumMessage: cc.Label = null;
    @property(cc.Label)
    m_NumFreeTotal: cc.Label = null;
    @property(cc.Label)
    m_NumFreeLeft: cc.Label = null;
    @property(cc.Label)
    m_NumBalance: cc.Label = null;
    @property(cc.Label)
    m_NumWin: cc.Label = null;
    //-----------------------------------------

    //Sounds-----------------------------------
    @property(cc.AudioClip)
    m_BetChangeSounds: cc.AudioClip[] = [];
    @property(cc.AudioClip)
    m_SoundFiles: cc.AudioClip[] = [];
    //-----------------------------------------

    //Animation Nodes--------------------------
    @property(sp.Skeleton)
    tree_Anim: sp.Skeleton = null;

    lastTreeAnimTime: Date = null;
    //-----------------------------------------

    winSoundDurations = [3.213, 2.951, 6.112, 5.511, 6.164];
    currentWinSoundDur = 0.00;

    delayovergame: cc.Node = null;

    wasFullscreen: boolean = false;
    nowResponsive: boolean = false;

    //#region Cocos Default Functions
    start() {
        // console.log('[GameScene]--start', 1);
        DataManager.getInstance().isOpen = true;

        // console.log('[GameScene]--start', 2);
        HttpClient.getInstance().setDialog(this.m_dialog);
        this.eventRegister();
        if (GlobalData.G_IsTest == true) {
            DataManager.getInstance().money = 100000000
        }
        // console.log('[GameScene]--start', 3);
        this.m_NumTotalBet.string = "0"
        this.m_NumWin.string = "0"
        this.updateMoney();

        // console.log('[GameScene]--start', 4);
        Sound.getInstance().loadSound(this.m_SoundFiles);
        NetTrans.setMainScene(this);
        // console.log('[GameScene]--start', 5);
        this.rollMgr.setMainScene(this);
        this.result.setMainScene(this);
        this.autoPlaySetting.setMainScene(this);

        //added by Petar 2022.09.07
        this.m_FreeStart.setMainScene(this);
        this.jackpotManager.setMainScene(this);

        // added to show balance and win on reconnection
        this.result.setScore(null);

        this.setVolume();
        this.result.hide();
        // console.log("---Result : " + DataManager.getInstance().result);
        this.rollMgr.setPic(DataManager.getInstance().result)

        this.onOverGame();
        this.delayovergame = new cc.Node();
        this.node.addChild(this.delayovergame);
        this.m_BigWinNode.node.active = false;

        Sound.getInstance().playBGMusic(Common.s_sound.MainBG, true);
        this.changeBetText()

        this.lastTreeAnimTime = new Date();

        // added for reconnect in freegame
        if (DataManager.getInstance().nextFree > 0) {
            if (DataManager.getInstance().freeType < 0) {
                this.m_FreeStart.show();
            }
        }
    }

    protected onLoad(): void {
        let self = this;
        // For event when the app entering background
        cc.game.on(cc.game.EVENT_HIDE, function () {
        });

        // For event when the app entering foreground
        cc.game.on(cc.game.EVENT_SHOW, function () {
            self.onFullScreen();
        });

        if (cc.sys.isMobile) {
            this.m_BtnFullScreenOff.node.active = false;
            this.m_BtnFullScreenOn.node.active = false;
        }
    }

    makeResponsive() {
        if (this.nowResponsive) return;
        if (!cc.sys.isMobile) return;

        this.nowResponsive = true;

        setTimeout(() => {
            let canvas = this.node.parent.getComponent(cc.Canvas);
            let deviceResolution = cc.view.getFrameSize();

            // calculte design ratio
            let desiredRatio = canvas.designResolution.width / canvas.designResolution.height;
            // calculte device ratio
            let deviceRatio = deviceResolution.width / deviceResolution.height;

            if (desiredRatio == deviceRatio) return;

            let ratio = canvas.designResolution.width / deviceResolution.width;
            let realHeight = deviceResolution.height * ratio;

            if (realHeight < canvas.designResolution.height) return;

            let offset = Math.floor(canvas.designResolution.height - realHeight);

            this.bgMasks.forEach(bgMask => {
                bgMask.enabled = false;
            });

            this.nodeHeader.runAction(cc.moveBy(0, 0, -offset / 2));
            this.nodeFooter.runAction(cc.moveBy(0, 0, offset / 2));
        }, 150);
    }

    makeResponsiveIOS() {
        if (this.nowResponsive) return;
        if (!cc.sys.isMobile) return;

        this.nowResponsive = true;

        setTimeout(() => {
            let canvas = this.node.parent.getComponent(cc.Canvas);
            let deviceResolution = cc.view.getFrameSize();

            // calculte design ratio
            let desiredRatio = canvas.designResolution.width / canvas.designResolution.height;
            // calculte device ratio
            let deviceRatio = deviceResolution.width / deviceResolution.height;

            if (desiredRatio == deviceRatio) return;

            let ratio = canvas.designResolution.width / deviceResolution.width;
            let realHeight = deviceResolution.height * ratio;

            if (realHeight < canvas.designResolution.height) return;

            let offset = Math.floor(canvas.designResolution.height - realHeight);

            this.bgMasks.forEach(bgMask => {
                bgMask.enabled = false;
            });

            this.nodeHeader.runAction(cc.moveBy(0, 0, -offset / 2));
            this.nodeFooter.runAction(cc.moveBy(0, 0, offset / 2));
        }, 150);
    }

    public update() {
        Common.elapse = cc.director.getDeltaTime();
        this.rollMgr.tick();
        if (DataManager.getInstance().status == Common.eStatus.Win) {
            this.result.tick();
        }

        // if (cc.screen['fullScreen']() != this.wasFullscreen) {
        //     this.wasFullscreen = cc.screen['fullScreen']();

        //     if (this.wasFullscreen) {
        //         this.makeResponsive();
        //     } else {
        //         this.onFullScreen();
        //     }
        //     // } else if (cc.sys.os == cc.sys.OS_IOS) {
        //     //     this.makeResponsiveIOS();
        // }
    }
    //#endregion

    //#region Common Functions
    public updateMoney() {
        // console.log('updateMoney', Common.addComma2Digits(DataManager.getInstance().money))
        // console.trace()
        this.m_NumBalance.string = Common.addComma2Digits(DataManager.getInstance().money);
    }

    public changeBetText() {
        // console.log("---changeBetText : " + Common.addComma2Digits(DataManager.getInstance().totalBet) + " , betIndex : " + DataManager.getInstance().betIndex + " , coinIndex : " + DataManager.getInstance().coinIndex);
        this.m_NumTotalBet.string = Common.addComma2Digits(DataManager.getInstance().totalBet);

        if (DataManager.getInstance().betIndex == Common.baseBet.length) {
            this.m_BtnBetMax.interactable = false;
        }
        else {
            this.m_BtnBetMax.interactable = true;
        }

        this.jackpotLayer.manualSetting({
            jp_value: [
                Common.addComma2Digits(Common.baseBet[DataManager.getInstance().betIndex - 1] * 200000),
                Common.addComma2Digits(Common.baseBet[DataManager.getInstance().betIndex - 1] * 75000),
                Common.addComma2Digits(Common.baseBet[DataManager.getInstance().betIndex - 1] * 3750),
                Common.addComma2Digits(Common.baseBet[DataManager.getInstance().betIndex - 1] * 2000)
            ]
        });
    }

    checkStatus() {
        if (DataManager.getInstance().auto || DataManager.getInstance().nextFree > 0) {
            this.m_BtnBetUp.interactable = false
            this.m_BtnBetDown.interactable = false
            this.m_BtnBetMax.interactable = false;
        } else {
            this.m_BtnBetUp.interactable = true
            this.m_BtnBetDown.interactable = true
            this.m_BtnBetMax.interactable = true;
        }
    }

    public EnableBtn(isflag) {
        if (DataManager.getInstance().nextFree > 0) {
            this.m_BtnBetUp.interactable = false
            this.m_BtnBetDown.interactable = false
        } else {
            this.m_BtnBetUp.interactable = isflag
            this.m_BtnBetDown.interactable = isflag
        }
    }

    public updateFullScreen() {
        if (cc.screen.fullScreen() == true) {
            this.m_BtnFullScreenOff.node.active = true;
            this.m_BtnFullScreenOn.node.active = false;
        } else {
            this.m_BtnFullScreenOff.node.active = false;
            this.m_BtnFullScreenOn.node.active = true;
        }

        if (cc.sys.isMobile) {
            this.m_BtnFullScreenOff.node.active = false;
            this.m_BtnFullScreenOn.node.active = false;
        }
    }

    // --- *** Button Registers *** --- 
    public onFullScreen() {
        cc.screen.requestFullScreen(document.documentElement, function () { });
        cc.tween(this.node).delay(0.1).call(() => {
            this.updateFullScreen();
        }).start();
    }

    public offFullScreen() {
        cc.screen.exitFullScreen();
        cc.tween(this.node).delay(0.1).call(() => {
            this.updateFullScreen();
        }).start();
    }

    public setVolume() {
        let curVolume: number = cc.audioEngine.getEffectsVolume();
        if (curVolume > 0) {
            this.m_BtnSoundOn.node.active = true;
            this.m_BtnSoundOff.node.active = false;
        } else {
            this.m_BtnSoundOn.node.active = false;
            this.m_BtnSoundOff.node.active = true;
        }
    }

    //0 : Normal Game, 1 : Free Game, 2 : Jackpot Game
    public setMainBG(flag, from = undefined) {
        switch (flag) {
            case 0:
                this.m_NodeNormal.getChildByName("node_NG_FG").active = true;
                this.m_NodeNormal.getChildByName("node_JP").active = false;
                this.m_NodeNormal.getChildByName("node_NG_FG").getChildByName("FGNumber").active = false;
                this.m_NodeNormal.getChildByName("node_NG_FG").getChildByName("Mask").getChildByName("Background_NG").getComponent(cc.Sprite).spriteFrame = this.spf_backImages[0];
                this.rollMgr.node.active = true;
                this.result.node.active = true;
                this.nodeFooter.active = true;
                break;
            case 1:
                this.m_NodeNormal.getChildByName("node_NG_FG").active = true;
                this.m_NodeNormal.getChildByName("node_JP").active = false;
                this.m_NodeNormal.getChildByName("node_NG_FG").getChildByName("FGNumber").active = true;
                this.m_NodeNormal.getChildByName("node_NG_FG").getChildByName("Mask").getChildByName("Background_NG").getComponent(cc.Sprite).spriteFrame = this.spf_backImages[1];
                this.rollMgr.node.active = true;
                this.result.node.active = true;
                this.nodeFooter.active = true;
                this.m_NumFreeTotal.string = '' + Math.floor(DataManager.getInstance().totalFreeSpins);
                this.m_NumFreeLeft.string = '' + Math.floor(DataManager.getInstance().nextFree);
                break;
            case 2:
                this.m_NodeNormal.getChildByName("node_NG_FG").active = false;
                this.m_NodeNormal.getChildByName("node_JP").active = true;
                this.rollMgr.node.active = false;
                this.result.node.active = false;
                this.nodeFooter.active = false;
                break;
        }

        if (from == 2) {
            this.tree_Anim.setAnimation(0, 'idle4', true);
        }
    }

    public setTreeAnimation() {
        let deltaTime = ((new Date()).getTime() - this.lastTreeAnimTime.getTime()) / 1000;

        let treeShakingNames = ["shake1", "shake2", "shake3", "shake4", "shake5", "shake6", "shake7", "shake8"];
        let treeCommonNames = ["open", "waiting"];
        let treeIdleNames = ["idle1", "idle2", "idle3", "idle4", "idle5", "idle6", "idle7", "idle8"];

        if (deltaTime > 1) {
            Sound.getInstance().playEffect(Common.s_sound.Tree_Shaking, false, true);
            this.tree_Anim.setAnimation(0, treeShakingNames[3], false);

            if (DataManager.getInstance().jackpots && DataManager.getInstance().jackpots.jackpotWin && DataManager.getInstance().jackpots.jackpotWin > 0) {
                this.tree_Anim.addAnimation(0, treeCommonNames[0], false);
                this.tree_Anim.addAnimation(0, treeCommonNames[1], true);
            } else {
                this.tree_Anim.addAnimation(0, treeIdleNames[3], true);
            }
        }

        this.lastTreeAnimTime = new Date();

    }
    //#endregion

    //#region BigWin Functions
    public playbigact() {

    }

    public hidebigact() {

    }

    public checkBigWin() {
        var odd = DataManager.getInstance().winMoney / DataManager.getInstance().totalBet;
        for (var i = Common.BigWinOdd.length - 1; i >= 0; i--) {
            if (odd >= Common.BigWinOdd[i]) {
                return i
            }
        }
        return -1
    }

    public showBigWin(bShow, style, s) {
        let self = this;
        this.m_BigWinNode.show(style, DataManager.getInstance().winMoney, function () {
            if (self.result.addingCoin > 0)
                self.result.addingCoinStop = true;
        });
        DataManager.getInstance().isBigWin = bShow
    }
    public hideBigWin() {
        this.m_BigWinNode.hide();
    }
    public playAddCoinSound() {
        this.currentWinSoundDur = 0;

        var style = this.checkBigWin()
        if (style > -1 && !DataManager.getInstance().free) {
            this.showBigWin(true, style, null)
            return true;
        } else {
            let winLineSoundID = Common.randomNumber(0, 4);

            this.currentWinSoundDur = this.winSoundDurations[winLineSoundID];

            Sound.getInstance().playEffect(Common.s_sound.LineWin_1 + winLineSoundID, false, true);
            return false;
        }
    }
    public delaySendOverGame() {
        this.playbigact();
        cc.tween(this.delayovergame).stop();
        let self = this
        cc.tween(this.delayovergame).delay(2).call(() => {
            self.onOverGame();
        }).start();
    }
    public freeDelaySendOverGame() {
        cc.tween(this.delayovergame).stop();
        let self = this
        cc.tween(this.delayovergame).delay(2).call(() => {
            self.onOverGame();
        }).start();
    }
    //#endregion

    //#region Main logic for Spin
    public eventRegister() {
        let self = this
        this.node.on(Common.CustomEvent.EventStartRoll, function () {
            // console.log("---EventStartRoll---");
            self.result.hide()

            DataManager.getInstance().lastBetIndex = DataManager.getInstance().betIndex;

            self.EnableBtn(false);
            self.hideBigWin();
            DataManager.getInstance().status = Common.eStatus.Running

            if (DataManager.getInstance().nextFree > 0) {
                self.rollMgr.setFreeColumn(2);
                self.m_NumFreeTotal.string = '' + Math.floor(DataManager.getInstance().totalFreeSpins);
                self.m_NumFreeLeft.string = '' + Math.floor(DataManager.getInstance().nextFree - 1);
            } else {
                self.rollMgr.setFreeColumn(1);
                if (DataManager.getInstance().free == true) {
                    self.setMainBG(1);
                    DataManager.getInstance().free = false;
                }
                if (DataManager.getInstance().autoNum > 0) {
                    self.m_NumMessage.string = '' + DataManager.getInstance().autoNum;
                }

                console.log('EventStartRoll', DataManager.getInstance().money, DataManager.getInstance().totalBet)
                DataManager.getInstance().money = DataManager.getInstance().money - DataManager.getInstance().totalBet

                if (DataManager.getInstance().money < 0) {
                    DataManager.getInstance().money = 0
                }
                self.updateMoney()
            }
            // console.log("---call changeBetText 1111---");
            self.changeBetText()

            DataManager.getInstance().overgame = false
            DataManager.getInstance().received = false
            DataManager.getInstance().betEnable = false

            if (GlobalData.G_IsTest) {
                cc.tween(self.node).delay(0.5).call(() => {
                    self.onResult()
                }).start()
            } else {
                NetTrans.sendStartInfo(DataManager.getInstance().totalBet / Common.baseCoin[0]);
            }
        });

        this.node.on(Common.CustomEvent.EventStartAll, function () {
            if (DataManager.getInstance().auto == false) {
                self.m_BtnSpin.active = false;
                self.m_BtnStop.node.active = false;
                self.m_BtnStopDisable.node.active = !DataManager.getInstance().auto;
                self.m_BtnAutoStop.interactable = false;

                cc.tween(self.delayovergame).delay(1).call(() => {
                    self.m_BtnStop.node.active = !DataManager.getInstance().auto;
                    self.m_BtnStopDisable.node.active = false;
                    self.m_BtnAutoStop.interactable = true;
                }).start();
            }

            // added by jaison to stop all sound effects on spin
            cc.audioEngine.stopAllEffects();
        });

        this.node.on(Common.CustomEvent.EventStopRoll, function () {
            let delaytime = 0;

            cc.tween(self.node).delay(delaytime).call(() => {
                self.result.show();
                if (DataManager.getInstance().winMoney > 0) {
                    DataManager.getInstance().status = Common.eStatus.Win;
                } else {
                    DataManager.getInstance().status = Common.eStatus.Wait;
                }
                DataManager.getInstance().isCanReset = false

                if (DataManager.getInstance().free && DataManager.getInstance().nextFree == 0) {
                    return
                } else if (DataManager.getInstance().free == false && DataManager.getInstance().nextFree > 0) {
                    return
                }

                cc.tween(self.node).delay(0.1).call(() => {
                    self.onOverGame()
                }).start()
            }).start();
        });

        this.node.on(Common.CustomEvent.EventStopAutoResult, function () {
            if (DataManager.getInstance().nextFree == 0) {
                if (DataManager.getInstance().overgame) {
                    if (DataManager.getInstance().totalBet > 0) {
                        self.onSpin()
                    }
                }
            }
        });
        this.node.on(Common.CustomEvent.EventStopRespinResult, function () {
            if (DataManager.getInstance().auto === true) {
                self.node.dispatchEvent(new cc.Event.EventCustom(Common.CustomEvent.EventStopAutoResult, true));
            }
        });
        this.node.on(Common.CustomEvent.EventStopFreeResult, function () {
            if (DataManager.getInstance().nextFree > 0) {
                if (DataManager.getInstance().overgame) {
                    self.onSpin();
                } else {
                    DataManager.getInstance().playEnd = true;
                }
            } else if (DataManager.getInstance().auto === true) {
                self.node.dispatchEvent(new cc.Event.EventCustom(Common.CustomEvent.EventStopAutoResult, true));
            }
        });
    }

    public bet() {
        DataManager.getInstance().totalBet = Common.baseBet[DataManager.getInstance().betIndex - 1] * Common.baseCoin[DataManager.getInstance().coinIndex - 1];
        this.checkStatus()

        this.changeBetText()
    }

    public reset(first) {
        if (DataManager.getInstance().nextFree > 0) {
            this.m_BtnStop.node.active = false;
            this.m_BtnSpin.active = true;

            this.m_BtnAutoStop.node.active = DataManager.getInstance().auto;
        } else {
            this.bet();
            if (DataManager.getInstance().totalBet > 0) {
                // console.log("---button change444444---");
                this.m_BtnStop.node.active = false
                this.m_BtnSpin.active = true
                this.m_BtnAutoStop.node.active = DataManager.getInstance().auto;
                this.m_BtnAutoStop.interactable = DataManager.getInstance().auto;
                if (DataManager.getInstance().auto) {
                } else {
                }
            }
        }

        if (first) {
            this.changeBetText()
        }
    }

    public onOverGame() {
        DataManager.getInstance().overgame = true
        if (DataManager.getInstance().nextFree > 0 && DataManager.getInstance().freeType >= 0) {
            if (DataManager.getInstance().isCanReset) {
                // console.log('11111');
                this.reset(NetTrans.first)
            }
            if (NetTrans.first) {
                DataManager.getInstance().free = true
                this.setMainBG(1);
                Sound.getInstance().stopBGMusic();
                Sound.getInstance().playBGMusic(Common.s_sound.FreeBG, true);

                this.onSpin();
            }
            if (!this.result.isVisible()) {
                if (DataManager.getInstance().playEnd) {
                    this.rollMgr.runAll();
                }
            }
        } else {
            if (!DataManager.getInstance().auto) {
                DataManager.getInstance().betEnable = true
            }
            if (DataManager.getInstance().isCanReset) {
                // console.log('2222');
                this.reset(NetTrans.first)
            }
            if (!this.result.isVisible()) {
                this.changeBetText()
                if (DataManager.getInstance().auto && DataManager.getInstance().playEnd) {
                    this.onSpin()
                }
            }
        }
        if (NetTrans.first) {
            NetTrans.first = false
        }
    }

    public onResult() {
        if (GlobalData.G_IsTest) {
            TestGetResult.generate()
        }

        DataManager.getInstance().received = true;
        this.result.setScore(null);
        this.rollMgr.setCanStop(DataManager.getInstance().result);
        if (this.rollMgr.isStopAll()) {
            if (DataManager.getInstance().auto == false) {
                // console.log("---button change555555---");
                this.m_BtnSpin.active = true;
                this.m_BtnStop.node.active = false;
                this.m_BtnStopDisable.node.active = false;
            }
        }
    }
    //#endregion

    //#region Bottom Buttons' Function
    public onSpin() {
        if (this.autoPlaySetting.node.active == true) {
            this.autoPlaySetting.node.active = false;
        }

        if (DataManager.getInstance().jackpots && DataManager.getInstance().jackpots.jackpotWin && DataManager.getInstance().jackpots.jackpotWin > 0) {
            return;
        }

        if (DataManager.getInstance().money < DataManager.getInstance().totalBet) {
            HttpClient.getInstance().dialg.show(Language.getInstance().getString('noBalance'));
            return;
        }

        if (DataManager.getInstance().auto == true && !DataManager.getInstance().free && DataManager.getInstance().nextFree <= 0) {
            DataManager.getInstance().autoNum--;
            if (DataManager.getInstance().autoNum <= 0) {
                DataManager.getInstance().autoNum = 0;
                DataManager.getInstance().auto = false
            }
        }

        if (DataManager.getInstance().free == false) {
            this.m_BtnSpin.active = false;
            this.m_BtnStop.node.active = false;
            this.m_BtnStopDisable.node.active = !DataManager.getInstance().auto;
            this.m_BtnAutoStop.interactable = false;
            var self = this;
            cc.tween(this.node).delay(1).call(() => {
                this.m_BtnStopDisable.node.active = false;
                this.m_BtnStop.node.active = !DataManager.getInstance().auto;
                this.m_BtnAutoStop.interactable = true;
            }).start();
        }
        // console.log("---onSPin : auto : " + DataManager.getInstance().auto + " , free : " + DataManager.getInstance().free + " , nextFree : " + DataManager.getInstance().nextFree + " , betMoney : " + DataManager.getInstance().totalBet);
        this.rollMgr.runAll();
    }

    public onStop() {
        if (DataManager.getInstance().auto) {
            this.onStopAuto();
        } else {
            Sound.getInstance().playEffect(Common.s_sound.BtnStop, false, true)
            if (DataManager.getInstance().received) {
                this.m_BtnSpin.active = true;
                this.m_BtnStop.node.active = false;
                this.m_BtnStopDisable.node.active = false;
            }
            this.rollMgr.stopAll()
        }
    }

    public onBetDown() {
        DataManager.getInstance().betIndex--;
        if (DataManager.getInstance().betIndex < 1) {
            DataManager.getInstance().betIndex = Common.baseBet.length;
        }

        DataManager.getInstance().totalBet = Common.baseBet[DataManager.getInstance().betIndex - 1] * Common.baseCoin[DataManager.getInstance().coinIndex - 1];
        this.changeBetText();

        cc.audioEngine.playEffect(this.m_BetChangeSounds[DataManager.getInstance().betIndex - 1], false);
    }

    public onBetUp() {
        DataManager.getInstance().betIndex++;
        if (DataManager.getInstance().betIndex > Common.baseBet.length) {
            DataManager.getInstance().betIndex = 1;
        }

        cc.audioEngine.playEffect(this.m_BetChangeSounds[DataManager.getInstance().betIndex - 1], false);
        DataManager.getInstance().totalBet = Common.baseBet[DataManager.getInstance().betIndex - 1] * Common.baseCoin[DataManager.getInstance().coinIndex - 1];
        this.changeBetText();
    }

    public onBetMax() {
        DataManager.getInstance().betIndex = Common.baseBet.length;

        cc.audioEngine.playEffect(this.m_BetChangeSounds[DataManager.getInstance().betIndex - 1], false);
        DataManager.getInstance().totalBet = Common.baseBet[DataManager.getInstance().betIndex - 1] * Common.baseCoin[DataManager.getInstance().coinIndex - 1];
        this.changeBetText();
    }

    public onInfo() {
        this.m_NodeHelp.active = true
        Sound.getInstance().playEffect(Common.s_sound.BtnSound, false, true)
    }

    public onAutoPlay() {
        // console.log("---On Auto Pannel opening---");
        Sound.getInstance().playEffect(Common.s_sound.AllButton, false, true)
        this.autoPlaySetting.node.active = true
        this.autoPlaySetting.getComponent(cc.Animation).play();
    }

    public onEventAutoPlay() {
        DataManager.getInstance().auto = true;
        this.m_BtnAutoStop.node.active = true;

        if (DataManager.getInstance().totalBet > 0) {
            this.onSpin()
        }
    }

    public onStopAuto() {
        Sound.getInstance().playEffect(Common.s_sound.AllButton, false, true)
        DataManager.getInstance().auto = false
        DataManager.getInstance().autoNum = 0;
        this.m_NumMessage.string = '';
        this.m_BtnSpin.active = true;
        this.m_BtnAutoStop.node.active = false;
        if (DataManager.getInstance().overgame) {
            DataManager.getInstance().betEnable = true
            this.checkStatus()
        } else {
        }
    }

    public onBackHome() {
        history.go(-1);
    }

    public onSoundOn() {
        Sound.getInstance().playEffect(Common.s_sound.BtnSound, false, true)
        cc.audioEngine.setEffectsVolume(0);
        cc.audioEngine.setMusicVolume(0);

        this.m_BtnSoundOff.node.active = true;
        this.m_BtnSoundOn.node.active = false;
    }

    public onSoundOff() {
        Sound.getInstance().playEffect(Common.s_sound.BtnSound, false, true)
        cc.audioEngine.setEffectsVolume(1);
        cc.audioEngine.setMusicVolume(1);

        this.m_BtnSoundOff.node.active = false;
        this.m_BtnSoundOn.node.active = true;
    }
    //#endregion

    //#region Not using Functions
    public onUpdateMoney(money) {
        // console.log("---onUpdateMoney : " + money);
        DataManager.getInstance().money = DataManager.getInstance().money + money
        if (DataManager.getInstance().money < 0.005) {
            DataManager.getInstance().money = 0
        }

        this.updateMoney()

        if ((DataManager.getInstance().status == Common.eStatus.Idle || DataManager.getInstance().status == Common.eStatus.Wait || DataManager.getInstance().status == Common.eStatus.Win) && DataManager.getInstance().overgame == true && DataManager.getInstance().nextFree <= 0) {
            this.m_BtnAutoStop.node.active = false;
            this.m_BtnSpin.active = true;

            this.reset(NetTrans.first)
            if (!this.result.isVisible()) {
                this.changeBetText()
                if (DataManager.getInstance().auto && DataManager.getInstance().playEnd) {
                    this.rollMgr.runAll();
                }
            }
        }
    }

    private changeBets(betIndex) {
        var betIndex = DataManager.getInstance().betIndex + betIndex;
        if (betIndex < 1) {
            betIndex = Common.baseBet.length;
        }

        if (betIndex > Common.baseBet.length) {
            betIndex = 1;
        }

        if (DataManager.getInstance().money <= 0.005) {
            return;
        }

        if (betIndex > 0 && betIndex <= Common.baseBet.length) {
            DataManager.getInstance().betIndex = betIndex;
            DataManager.getInstance().totalBet = Common.baseCoin[0] * Common.baseBet[betIndex - 1];
            this.changeBetText();
        }
    }

    public leave() {
        this.node.stopAllActions()
        this.result.leave()
        this.rollMgr.leave()
    }

    //#endregion
}
