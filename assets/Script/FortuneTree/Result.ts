// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BtnTouchListener from "../Common/BtnTouchListener";
import { Common } from "../Common/Common";
import GlobalData from "../Common/GlobalData";
import { Sound } from "../Common/Sound";
import Language from "../Language/Language";
import { DataManager } from "./DataManager";
import GameScene from "./GameScene";
import { NetTrans } from "./NetTrans";
import Symbol from "./Symbol";
const { ccclass, property } = cc._decorator;

@ccclass
export default class Result extends cc.Component {

    nextShow: number = 0;
    EleNodes: cc.Node[][] = [[]];
    child: cc.Node[][] = [[]];

    @property(cc.Prefab)
    item: cc.Prefab = null;
    @property(cc.Node)
    node_empty: cc.Node = null;

    win: number = 0;
    targetCoin: number = 0;
    targetCoinFree: number = 0;
    addingCoin: number = 0;
    addingTime: number = Common.addCoinTime;
    addingCoinStop: boolean = false;
    bIsShowFreeOver: boolean = false;
    winCount: number = 0;
    FinalCoin: number = 0;
    isRight: [] = [];
    nodeGray: [] = [];

    isChildOver: boolean = false;
    isLineDone: boolean = false;
    isCoinDone: boolean = false;
    isAddCoinDown: boolean = false;
    ClipNode: null;
    A = null;
    nextLine = 0;
    S = 0;
    D: boolean = false;
    m = 0;
    mainScene: GameScene = null;
    winMoney: number = 0;


    onLoad() {
        for (let i = 0; i < Common.NUMBER_OF_COLUMN; i++) {
            this.child[i] = [];

            for (let j = Common.NUMBER_OF_ROW - 1; j >= 0; j--) {

                const reelSymbol = cc.instantiate(this.item);
                const symbolInfo = reelSymbol.getComponent(Symbol);
                symbolInfo.init((i * Common.NUMBER_OF_ROW + j) % 9);

                this.child[i][j] = reelSymbol;
                this.child[i][j].setAnchorPoint(0.5, 0.5);
                this.child[i][j].setPosition(Common.XDIFF * i + Common.ELEMENT_WIDTH / 2, (Common.ELEMENT_HEIGHT * j + Common.ELEMENT_HEIGHT / 2));

                this.child[i][j].active = false;
                this.node.addChild(this.child[i][j]);
            }
        }
        this.node.active = false;
    }

    public onCheckAutoBtn() {
        if (DataManager.getInstance().isAutoOnWin == true || (DataManager.getInstance().isAutoFreeSpin && DataManager.getInstance().nextFree > 0)) {
            DataManager.getInstance().auto = false;
            DataManager.getInstance().autoNum = 0;
            this.mainScene.m_NumMessage.node.active = false;
            this.mainScene.m_BtnAutoStop.node.active = false;
            if (DataManager.getInstance().nextFree > 0) {
            }
        }
    }
    public show() {
        this.winMoney = DataManager.getInstance().winMoney;
        Sound.getInstance().stopEffect(Common.s_sound.ScatterReelAnim)
        this.node.active = true;
        cc.tween(this.node).stop();
        let time = 0;

        if (DataManager.getInstance().winMoney > 0) {
            for (let i = 0; i < Common.NUMBER_OF_COLUMN; i++) {
                for (let j = 0; j < Common.NUMBER_OF_ROW; j++) {
                    this.EleNodes[i][j].active = true;
                    this.child[i][j].active = false;
                }
            }
            this.onWin();
        } else {
            this.onLose();
        }
        if (DataManager.getInstance().free) {
            this.bIsShowFreeOver = false
        }
    }

    public winFree() {
        var self: Result = this;

        for (let i = 0; i < Common.NUMBER_OF_COLUMN; i++) {
            for (let j = 0; j < Common.NUMBER_OF_ROW; j++) {
                if (DataManager.getInstance().resultReal[i][j] == Common.scatterSymbol) {

                    this.child[i][j].active = true;
                    this.child[i][j].getComponent(Symbol).stopAnimation();
                    this.child[i][j].getComponent(Symbol).resetItem(Common.scatterSymbol);

                    this.child[i][j].getComponent(Symbol).runAnimation(false);

                    this.EleNodes[i][j].active = false;
                } else {
                    this.child[i][j].active = false;
                    this.EleNodes[i][j].active = true
                }
            }
        }
        cc.tween(this.node).delay(2).call(() => {
            Sound.getInstance().stopBGMusic();
            Sound.getInstance().playBGMusic(Common.s_sound.FreeBG, true);

            //added by Petar 2022.09.21
            self.mainScene.reset(NetTrans.first);

            if (DataManager.getInstance().moreFreeSpin > 0) {
                self.showMoreFree();
                DataManager.getInstance().moreFreeSpin = 0;
            } else self.mainScene.m_FreeStart.show();
        }).start()
    }

    public onPlayEnd(parent: Result) {
        let self = parent;
        if (DataManager.getInstance().free && DataManager.getInstance().nextFree == 0) {
            self.showFreeEnd()
        } else if (DataManager.getInstance().auto || DataManager.getInstance().nextFree > 0) {
            DataManager.getInstance().isCanReset = true
            if (DataManager.getInstance().overgame) {
                self.mainScene.reset(NetTrans.first)
            }
            DataManager.getInstance().playEnd = false
            let delaytime = 0.5;
            if (self.winCount > 0 && DataManager.getInstance().SCANum < 3) {
                delaytime = Common.nomalWinDelayTime;

                // by jaison
                delaytime = self.mainScene.currentWinSoundDur;
                if (delaytime > Common.nomalWinDelayTime * self.winCount) delaytime = delaytime - Common.nomalWinDelayTime * self.winCount;
                else delaytime = 0.5;
            }
            cc.tween(self.node).delay(delaytime).call(() => {
                DataManager.getInstance().playEnd = true
                var event = null
                if (DataManager.getInstance().nextFree > 0) {
                    self.mainScene.node.dispatchEvent(new cc.Event.EventCustom(Common.CustomEvent.EventStopFreeResult, true));
                } else if (DataManager.getInstance().auto) {
                    self.mainScene.node.dispatchEvent(new cc.Event.EventCustom(Common.CustomEvent.EventStopAutoResult, true));
                }
                self.hide()
            }).start();
        } else {
            DataManager.getInstance().isCanReset = true
            if (DataManager.getInstance().overgame) {
                self.mainScene.reset(NetTrans.first)
            }
            self.mainScene.EnableBtn(true)
        }

        if (DataManager.getInstance().jackpots.jackpotWin && DataManager.getInstance().jackpots.jackpotWin > 0) {
            setTimeout(() => {
                self.mainScene.jackpotManager.setSelectionResult(DataManager.getInstance().jackpots.jackpotWin, DataManager.getInstance().jackpots.jackpotSelects);
                self.mainScene.jackpotManager.perform();
            }, 1500);
        }
    }
    public doLossShowEnd() {
        let self = this
        cc.tween(this.node).delay(0.3).call(() => {
            if (DataManager.getInstance().SCANum >= 3) {
                self.winFree()
                return
            } else {
                self.onPlayEnd(self)
            }
        }).start();
    }
    public onLose() {
        this.node.active = true;
        var delaytime = 0
        this.isLineDone = true

        this.doLossShowEnd()
    }
    public setNextShow(next) {
        this.nextShow = next
        this.isLineDone = true

        for (var i = 0; i < Common.NUMBER_OF_COLUMN; i++) {
            for (var j = 0; j < Common.NUMBER_OF_ROW; j++) {
                this.child[i][j].active = false;
                this.EleNodes[i][j].active = true;
            }
        }

        if (DataManager.getInstance().SCANum >= 3) {
            this.mainScene.hideBigWin();
            this.winFree();
        } else {
            this.showEleAct()
            cc.tween(this.node).delay(Common.nomalWinDelayTime).call(() => {
                this.stopEleAct()
            }).call(() => {
                this.setNextShow(this.nextShow)
            }).start();
        }
    }
    public startNext() {
        let index = this.nextShow;
        if (index >= DataManager.getInstance().winLine.length) {
            this.nextShow = 0;
            this.isLineDone = true;
            cc.tween(this.node).stop();
            this.setNextShow(-1);

            if (DataManager.getInstance().SCANum < 3) {
                this.onPlayEnd(this);
            }

            return
        }

        this.nextShow = index + 1;
        let time = this.showWinLine(index);
        cc.tween(this.node).stop();
        cc.tween(this.node).delay(Number(time)).call(() => {
            this.stopEleAct()
        }).delay(0.1).call(() => {
            this.startNext()
        }).start();
    }
    public onWin() {
        let self: Result = this;
        this.node.active = true;
        this.mainScene.m_NumWin.node.active = true;
        this.mainScene.m_NumWin.string = '';

        if (DataManager.getInstance().auto == true) {
            this.onCheckAutoBtn();
        }
        this.winCount = this.getWinLineCount();
        this.nextShow = 0;

        cc.tween(this.node).delay(0.2).call(() => {
            this.startAddCoin();
            this.mainScene.playAddCoinSound();
            if (this.winCount == 0) {
                cc.tween(this.node).delay(self.mainScene.currentWinSoundDur).call(() => {
                    if (DataManager.getInstance().SCANum < 3) {
                        this.onPlayEnd(this);
                    }
                    this.setNextShow(-1)
                }).start();
            } else {
                this.startNext()
            }
        }).start();
    }

    public startAddCoin() {
        if (DataManager.getInstance().SCANum < 3) {
            DataManager.getInstance().isCanReset = true;
            if (DataManager.getInstance().overgame) {
                // console.log('cccc');
                this.mainScene.reset(NetTrans.first);
            }
        }
        if (DataManager.getInstance().free) {
            this.addingCoin = 2
        } else {
            this.addingCoin = 1
        }
    }
    public setScore(flag) {
        this.win = DataManager.getInstance().winMoney;
        if (this.win > 0.3) {
            if (flag != null && flag) {
                this.addingTime = Common.addCoinTimeFree
            } else {
                if (this.mainScene.checkBigWin() > 2) {
                    this.addingTime = Common.addCoinTimeFree
                } else {
                    this.addingTime = Common.addCoinTime
                }
            }
        } else {
            this.addingTime = 15 / 1000 * this.win / 0.01;
        }

        if (flag != null && flag) {
            this.FinalCoin = DataManager.getInstance().money + DataManager.getInstance().winMoney;
        } else {
            if (DataManager.getInstance().free) {
                this.targetCoinFree = DataManager.getInstance().winTotalFreeMoney + DataManager.getInstance().winMoney;
            } else {
                this.FinalCoin = DataManager.getInstance().money + DataManager.getInstance().winMoney;
            }
        }
    }
    public stopEleAct() {
        for (var i = 0; i < Common.NUMBER_OF_COLUMN; i++) {
            for (var j = 0; j < Common.NUMBER_OF_ROW; j++) {
                this.child[i][j].getComponent(Symbol).stopAnimation()
                this.child[i][j].active = false
                this.EleNodes[i][j].active = true
            }
        }
    }

    private showWinLine(key) {
        for (let i = 0; i < DataManager.getInstance().winLineNum[key].length; i++) {
            let eleColIndex = Math.floor(DataManager.getInstance().winLineNum[key][i] / 5);
            let eleRowIndex = DataManager.getInstance().winLineNum[key][i] % 5;
            let ele = DataManager.getInstance().resultReal[eleColIndex][eleRowIndex];

            if (DataManager.getInstance().free == false) {
                this.EleNodes[eleColIndex][eleRowIndex].active = false;

                this.child[eleColIndex][eleRowIndex].active = true;
                this.child[eleColIndex][eleRowIndex].getComponent(Symbol).stopAnimation();
                this.child[eleColIndex][eleRowIndex].getComponent(Symbol).resetItem(ele);

                this.child[eleColIndex][eleRowIndex].getComponent(Symbol).runAnimation(false);
            }
        }
        return Common.nomalWinDelayTime
    }
    public showEleAct() {
        for (var key = 0; key < DataManager.getInstance().winLine.length; key++) {
            var lineNum = DataManager.getInstance().winLineNum[key];

            for (let i = 0; i < lineNum.length; i++) {
                let eleColIndex = Math.floor(lineNum[i] / 5);
                let eleRowIndex = lineNum[i] % 5;
                let ele = DataManager.getInstance().resultReal[eleColIndex][eleRowIndex];

                this.child[eleColIndex][eleRowIndex].active = true;
                this.child[eleColIndex][eleRowIndex].getComponent(Symbol).stopAnimation();
                this.child[eleColIndex][eleRowIndex].getComponent(Symbol).resetItem(ele);

                this.child[eleColIndex][eleRowIndex].getComponent(Symbol).runAnimation(false);
                this.EleNodes[eleColIndex][eleRowIndex].active = false;
            }
        }
    }
    public showMoreFree() {
        let self = this;
        this.mainScene.hideBigWin();
        this.mainScene.m_MoreFree.show(DataManager.getInstance().moreFreeSpin, function () {
            self.onPlayEnd(self);
            self.mainScene.m_BtnSpin.getComponent(BtnTouchListener).interactable = true;
        });
        cc.tween(self.mainScene.node).delay(0.5).call(() => {
            self.mainScene.onOverGame();
        }).start();
    }
    public showFreeEnd() {
        if (!this.isVisible()) {
            this.node.active = true
        }

        let self = this;

        cc.tween(this.node).delay(0.5).call(() => {
            Sound.getInstance().stopBGMusic();
            self.mainScene.m_FreeEnd.show(0, function () {
                DataManager.getInstance().isCanReset = true;
                if (DataManager.getInstance().overgame) {
                    // console.log('dddd');
                    self.mainScene.reset(NetTrans.first)
                }
                DataManager.getInstance().playEnd = false;
                DataManager.getInstance().free = false;
                self.mainScene.setMainBG(0);
                Sound.getInstance().playBGMusic(Common.s_sound.MainBG, true);
                DataManager.getInstance().playEnd = true;
                self.hide()
                if (DataManager.getInstance().auto) {
                    self.mainScene.node.dispatchEvent(new cc.Event.EventCustom(Common.CustomEvent.EventStopAutoResult, true));
                }

                self.mainScene.m_BtnSpin.getComponent(BtnTouchListener).interactable = true;
            });
        }).delay(0.8).call(() => {
            self.bIsShowFreeOver = true
            DataManager.getInstance().status = Common.eStatus.Win
            DataManager.getInstance().winMoney = DataManager.getInstance().winTotalFreeMoney
            DataManager.getInstance().winShow = DataManager.getInstance().winShow - DataManager.getInstance().winTotalFreeMoney
            if (DataManager.getInstance().winShow < 0) {
                DataManager.getInstance().winShow = 0
            }
            DataManager.getInstance().winTotalFreeMoney = 0
            self.targetCoinFree = 0
            self.setScore(true)
            self.mainScene.playAddCoinSound()
            self.addingCoin = 3
            self.mainScene.m_NumWin.node.active = true

            cc.tween(self.mainScene.node).delay(0.5).call(() => {
                self.mainScene.onOverGame();
            }).start();
        }).start();
    }

    public tickFreeWin() {
        var diff = Common.addCoinDiffMin
        if (this.win > 0) {
            diff = Common.elapse / this.addingTime * this.win
        }
        if (diff < Common.addCoinDiffMin) {
            diff = Common.addCoinDiffMin
        } else if (diff > Common.addCoinDiffMax) {
            diff = Common.addCoinDiffMax
        }

        //added by Petar 2022.09.21
        if (this.win % 1 === 0) {
            diff = Math.ceil(diff);

            if (this.addingCoinStop) {
                diff = DataManager.getInstance().winMoney + 1;
            }
        }
        else {
            if (this.addingCoinStop) {
                diff = DataManager.getInstance().winMoney + 0.1;
            }
        }
        DataManager.getInstance().winMoney = DataManager.getInstance().winMoney - diff
        DataManager.getInstance().winShow = DataManager.getInstance().winShow + diff
        DataManager.getInstance().winTotalFreeMoney = DataManager.getInstance().winTotalFreeMoney + diff
        if (DataManager.getInstance().winMoney < 0) {
            this.isCoinDone = true
            DataManager.getInstance().winShow = DataManager.getInstance().winShow + DataManager.getInstance().winMoney
            DataManager.getInstance().winTotalFreeMoney = this.targetCoinFree
            this.targetCoinFree = 0
            this.addingCoin = 0
            this.addingCoinStop = false
            DataManager.getInstance().winMoney = 0
        }
        this.mainScene.m_NumWin.string = Common.addComma2Digits(DataManager.getInstance().winShow)
    }
    public tick() {
        if (this.addingCoin == 1) {
            var diff = Common.addCoinDiffMin;
            if (this.win > 0) {
                diff = Common.elapse / this.addingTime * this.win
            }

            if (diff < Common.addCoinDiffMin) {
                diff = Common.addCoinDiffMin
            } else if (diff > Common.addCoinDiffMax) {
                diff = Common.addCoinDiffMax
            }

            if (this.win % 1 === 0) {
                diff = Math.ceil(diff);
            }

            if (this.addingCoinStop) {
                diff = DataManager.getInstance().winMoney + 1
            }
            DataManager.getInstance().winMoney = DataManager.getInstance().winMoney - diff
            DataManager.getInstance().winShow = DataManager.getInstance().winShow + diff

            DataManager.getInstance().money = DataManager.getInstance().money + diff

            if (DataManager.getInstance().winMoney < 0) {
                this.isCoinDone = true;
                DataManager.getInstance().winShow = this.win;
                DataManager.getInstance().money = this.FinalCoin;
                this.FinalCoin = 0;
                this.addingCoin = 0;
                this.addingCoinStop = false;

                DataManager.getInstance().winMoney = 0;
            }

            // console.log('tick', 1, Common.addComma2Digits(DataManager.getInstance().money))
            this.mainScene.m_NumBalance.string = Common.addComma2Digits(DataManager.getInstance().money);
            this.mainScene.m_NumWin.string = Common.addComma2Digits(DataManager.getInstance().winShow)
        } else if (this.addingCoin == 2) {
            this.tickFreeWin()
        } else if (this.addingCoin == 3) {
            var diff = Common.addCoinDiffMin
            if (this.win > 0) {
                diff = Common.elapse / this.addingTime * this.win
            }

            if (diff < Common.addCoinDiffMin) {
                diff = Common.addCoinDiffMin
            } else if (diff > Common.addCoinDiffMax) {
                diff = Common.addCoinDiffMax
            }

            if (this.addingCoinStop) {
                diff = DataManager.getInstance().winMoney + 1
            }
            DataManager.getInstance().winMoney = DataManager.getInstance().winMoney - diff
            DataManager.getInstance().winShow = DataManager.getInstance().winShow + diff
            // if(DataManager.getInstance().winShow > this.win){
            //     DataManager.getInstance().winShow = this.win
            // }
            DataManager.getInstance().money = DataManager.getInstance().money + diff
            if (DataManager.getInstance().winMoney < 0) {
                // Sound.stopEffect(s_sound.AztecCount)
                this.isCoinDone = true
                DataManager.getInstance().winShow = DataManager.getInstance().winShow + DataManager.getInstance().winMoney
                DataManager.getInstance().money = this.FinalCoin
                this.FinalCoin = 0
                this.addingCoin = 0
                this.addingCoinStop = false
                DataManager.getInstance().winMoney = 0

                //removed by Petar 2022.09.13
                //Sound.getInstance().stopEffect(Common.s_sound.NewXiFen)                
            }
            // console.log('tick', 3, Common.addComma2Digits(DataManager.getInstance().money))
            this.mainScene.m_NumBalance.string = Common.addComma2Digits(DataManager.getInstance().money);
            this.mainScene.m_FreeEnd.lbl_freeSpinWin.string = Common.addComma2Digits(DataManager.getInstance().winShow);
        }
    }
    public stopResult() {
        this.nextShow = -1
        this.nextLine = 0
        this.isLineDone = false
        this.isCoinDone = false
        this.isChildOver = false
        this.winCount = 0
        this.D = false
        this.S = 0

        if (DataManager.getInstance().nextFree > 0 || DataManager.getInstance().free) {
            DataManager.getInstance().winShow = DataManager.getInstance().winShow + DataManager.getInstance().winMoney
            DataManager.getInstance().winMoney = 0
            if (this.targetCoinFree > 0) {
                DataManager.getInstance().winTotalFreeMoney = this.targetCoinFree
                this.targetCoinFree = 0
            }

            if (DataManager.getInstance().winShow > 0) {
                this.mainScene.m_NumWin.node.active = true
                this.mainScene.m_NumWin.string = Common.addComma2Digits(DataManager.getInstance().winShow)
            } else {
                this.mainScene.m_NumWin.node.active = true
            }
        } else {
            if (DataManager.getInstance().winMoney > 0) {
                DataManager.getInstance().money = this.FinalCoin
                this.FinalCoin = 0
                DataManager.getInstance().winMoney = 0
            }
            DataManager.getInstance().winShow = 0
            this.mainScene.m_NumWin.string = '' //PLACE YOUR BETS!
        }

        this.addingCoin = 0
        if (!this.isVisible()) {
            return
        }

        // console.log('stopResult', 3, Common.addComma2Digits(DataManager.getInstance().money))
        this.mainScene.m_NumBalance.string = Common.addComma2Digits(DataManager.getInstance().money);
        for (var i = 0; i < Common.NUMBER_OF_COLUMN; i++) {
            for (var j = 0; j < Common.NUMBER_OF_ROW; j++) {
                this.EleNodes[i][j].active = true
                this.child[i][j].active = false
            }
        }

        this.node.stopAllActions()
    }

    public hide() {
        this.stopResult();
        this.node.active = false
        this.isAddCoinDown = false
        this.m = 0
        this.nextLine = 0
        this.mainScene.hideBigWin();
    }

    public getWinLineCount() {
        return DataManager.getInstance().winLine.length;
    }

    public isVisible() {
        return this.node.active
    }

    public setMainScene(mainScene: GameScene) {
        this.mainScene = mainScene;
        this.EleNodes = this.mainScene.rollMgr.getEleNodes();
    }

    public leave() {
        if (this.targetCoin > 0) {
            DataManager.getInstance().money = this.targetCoin
        }
    }
}
