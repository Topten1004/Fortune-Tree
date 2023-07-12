// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Common } from "../Common/Common";
import { Sound } from "../Common/Sound";
import { DataManager } from "./DataManager";
import GameScene from "./GameScene";
import ReelColumn from "./ReelColumn";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RollMgr extends cc.Component {
    stopIndex: number[][] = [[]];
    stopMoneyIndex: number[][] = [[]];
    run: boolean = false;
    canStop: boolean = false;
    time = [];
    singleStart = [];
    bCanBonusEffect = [];
    stoppedCount: number = 0;
    speedUpCount: number = 0;
    allStop: boolean = false;
    speedUpSound: boolean = false;
    showGray: boolean = false;

    accelTime: number = 0;

    mainScene: GameScene;

    @property(ReelColumn)
    columns: ReelColumn[] = [];

    onLoad() {
        this.run = false;
        this.canStop = false;
        this.time = [];
        this.singleStart = [];
        this.bCanBonusEffect = [];
        this.stoppedCount = 0;
        this.speedUpCount = 0;
        this.allStop = false;
        this.speedUpSound = false;
        this.showGray = false;
        this.accelTime = 0;

        for (let i = 0; i < Common.NUMBER_OF_COLUMN; i++) {
            this.time[i] = 0.0;
        }
    }

    start() {

    }

    public runAll() {
        this.speedUpSound = false;
        if (this.run != true) {
            this.onFirstRun();
        }

        let count = 0;
        for (let i = 0; i < Common.NUMBER_OF_COLUMN; i++) {
            if (this.columns[i].getStatus() == ReelColumn.eStatus.Idle) {
                let index = i;
                let delaytime = count * 0.1;
                cc.tween(this.columns[i]).delay(delaytime).call(() => {
                    if (this.speedUpCount >= 2) {
                        this.columns[index].run(true);
                    } else {
                        this.columns[index].run(false);
                    }

                    this.time[index] = Common.firstStopTime + index * Common.stopTime;

                    cc.tween(this.columns[index]).stop();
                }).start();

                count = count + 1
            }
        }

        this.onAllRun();
    }

    public onFirstRun() {
        this.reset();

        this.mainScene.node.dispatchEvent(new cc.Event.EventCustom(Common.CustomEvent.EventStartRoll, true));
    }

    public onAllRun() {
        this.mainScene.node.dispatchEvent(new cc.Event.EventCustom(Common.CustomEvent.EventStartAll, true));
    }

    public onSetStop(col) {
        let stoped = false;
        var isScatter = false;
        for (let key in this.stopIndex[col]) {
            if (this.stopIndex[col][key] == Common.scatterSymbol || (this.stopIndex[col][key] == Common.wildSymbol && col > 0)) {
                this.speedUpCount++;
                isScatter = true;

                //if first Reel has scatter or all before Reels have scatter
                if (col == 0 || this.speedUpCount == col + 1) {
                    if (col == 0) {
                        Sound.getInstance().stopEffect(Common.s_sound.RealScatter);
                    }

                    Sound.getInstance().playEffect(Common.s_sound.RealScatter, false, false);
                }
            }
        }
        if ((this.speedUpCount >= 2) && this.stoppedCount < 4) {
            stoped = true;
            this.columns[col].stop(this.bCanBonusEffect[col], this.showGray, this.stopIndex[col], this.allStop)

            if (this.allStop == false) {
                this.reorderTimes()
            }
        }

        if (stoped == false) {
            this.columns[col].stop(this.bCanBonusEffect[col], this.showGray, this.stopIndex[col], this.allStop)
        }

        for (let i = 0; i < Common.NUMBER_OF_COLUMN; i++) {
            if (this.columns[i].getStatus() == ReelColumn.eStatus.run) return;
        }
    }

    public onAllStop() {
        this.showGray = false;

        if (this.speedUpSound == true) {
            this.speedUpSound = false;
        }

        this.allStop = false;
        this.canStop = false;
        this.stoppedCount = 0;
        this.speedUpCount = 0;

        for (let i = 0; i < Common.NUMBER_OF_COLUMN; i++) {
            this.columns[i].reset();
            this.singleStart[i] = false;
            this.bCanBonusEffect[i] = false;
            this.time[i] = Common.firstStopTime + i * Common.stopTime;
        }

        this.mainScene.node.dispatchEvent(new cc.Event.EventCustom(Common.CustomEvent.EventStopRoll, true));
    }

    public stopAll() {
        this.allStop = true;
        for (let i = 0; i < Common.NUMBER_OF_COLUMN; i++) {
            this.time[i] = 0;
        }
    }

    public isStopAll() {
        return this.allStop;
    }

    public getEleNodes() {
        let nodes = [];

        for (let i = 0; i < Common.NUMBER_OF_COLUMN; i++) {
            nodes[i] = this.columns[i].getNodes();
        }

        return nodes;
    }

    public setCanStop(result) {
        this.stopIndex = result;
        this.canStop = true

        if (this.allStop == true) {
            for (let i = 0; i < Common.NUMBER_OF_COLUMN; i++) {
                this.columns[i].stop(this.bCanBonusEffect[i], this.showGray, this.stopIndex[i], this.allStop)
            }
        } else {
            this.reorderTimes();
        }
    }
    public setPic(result) {
        for (let i = 0; i < Common.NUMBER_OF_COLUMN; i++) {
            this.columns[i].setPic(result[i]);
        }
    }
    public reorderTimes() {
        let firstUnStop = 0;
        let baseTime = 0;

        for (let i = 0; i < Common.NUMBER_OF_COLUMN; i++) {
            if (this.singleStart[i] != true) {
                firstUnStop = i;
                baseTime = this.time[i];
                if (baseTime < 0) {
                    baseTime = 0;
                }

                break
            }
        }

        if (firstUnStop != 0) {
            let count = 0;
            for (let i = firstUnStop - 1; i < Common.NUMBER_OF_COLUMN; i++) {
                if (this.singleStart[i] != true) {
                    this.time[i] = baseTime + count * Common.stopTime;
                    count = count + 1;
                }
            }
        }
    }

    public reset() {
        this.run = true;
    }

    public setFreeColumn(free) {
        for (let i = 0; i < Common.NUMBER_OF_COLUMN; i++) {
            this.columns[i].setFreeColumn(free);
        }
    }

    public tick() {
        this.accelTime = this.accelTime + Common.elapse;
        if (this.run == false) {
            return;
        }

        for (let i = 0; i < Common.NUMBER_OF_COLUMN; i++) {
            this.time[i] = this.time[i] - Common.elapse;

            let stopped = this.columns[i].tick();
            if (this.canStop == true) {
                if (this.time[i] < 0) {
                    if (this.columns[i].getStatus() == ReelColumn.eStatus.run) {
                        this.onSetStop(i);
                    } else if (this.columns[i].getStatus() == ReelColumn.eStatus.stopping) {
                        if (this.allStop && Common.changePic) {
                            this.columns[i].setChangePic(true);
                        }
                    }
                }

                if (stopped == true) {
                    this.stoppedCount = this.stoppedCount + 1
                    if (this.stoppedCount == Common.NUMBER_OF_COLUMN) {
                        this.run = false
                        this.onAllStop()
                        break
                    }
                }
            }
        }
    }

    public setMainScene(mainScene) {
        this.mainScene = mainScene;
    }

    public leave() {
        for (let i = 0; i < Common.NUMBER_OF_COLUMN; i++) {
            this.columns[i].leave();
        }
    }
}
