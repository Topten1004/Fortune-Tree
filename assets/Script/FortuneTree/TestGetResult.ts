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
export class TestGetResult {
    public static first: boolean = false
    public static isJackpot: boolean = false
    public static firstRespin: boolean = false
    public static waitFree: boolean = false
    public static ratio = [
        [0, 0, 0, 0, 0],
        [0, 0, 100, 200, 1000],
        [0, 0, 50, 100, 500],
        [0, 0, 40, 80, 400],
        [0, 0, 25, 50, 250],
        [0, 0, 10, 20, 100],
        [0, 0, 5, 10, 50],
        [0, 0, 5, 10, 50],
        [0, 0, 5, 10, 50],
        [0, 0, 5, 10, 50],
        [0, 0, 5, 10, 50],
        [0, 0, 5, 10, 50],
        [0, 0, 5, 10, 50],
    ]

    public static jackTypes = [
        2000, //Mini
        3750, //Minor
        75000, //Major
        200000 //Grand
    ];


    public static firstData = [
        //[[10, 0, 4], [0, 3, 5], [11, 8, 8], [6, 6, 1], [3, 8, 4]],
        [[10, 4, 12], [0, 3, 5], [11, 8, 12], [6, 6, 1], [3, 8, 4]],
        [[8, 5, 9], [3, 6, 10], [3, 4, 6], [7, 10, 1], [3, 10, 4]],
        [[8, 5, 2], [10, 6, 7], [8, 4, 9], [7, 10, 1], [3, 10, 4]],
        [[10, 5, 9], [3, 6, 10], [9, 4, 6], [7, 10, 9], [3, 10, 4]],
    ]

    public static generate() {
        DataManager.getInstance().SCANum = 0
        DataManager.getInstance().winMoney = 0
        DataManager.getInstance().moreFreeSpin = 0

        DataManager.getInstance().nextFree = DataManager.getInstance().nextFree - 1
        if (DataManager.getInstance().nextFree < 0) {
            DataManager.getInstance().nextFree = 0
        }

        DataManager.getInstance().winLineNum = []
        DataManager.getInstance().winLine = []

        let column = Common.REEL_DATA
        if (DataManager.getInstance().free == true) {
            // console.log("---TestGetResult free id : " + DataManager.getInstance().freeType);
            switch (DataManager.getInstance().freeType) {
                case 0:
                    column = Common.FREE_REEL_DATA1;
                    break;
                case 1:
                    column = Common.FREE_REEL_DATA2;
                    break;
                case 2:
                    column = Common.FREE_REEL_DATA3;
                    break;
                case 3:
                    column = Common.FREE_REEL_DATA4;
                    break;
                case 4:
                    column = Common.FREE_REEL_DATA5;
                    break;
            }
        } else {
            DataManager.getInstance().moreFreeSpin = 0;
            DataManager.getInstance().totalFreeSpins = 0;
        }

        for (var i = 0; i < Common.NUMBER_OF_COLUMN; i++) {
            DataManager.getInstance().result[i] = []
            DataManager.getInstance().resultReal[i] = []
            var count = column[i].length;
            var rand = Math.floor(Math.random() * count);
            for (var j = 0; j < Common.NUMBER_OF_ROW; j++) {
                DataManager.getInstance().result[i][j] = DataManager.getInstance().resultReal[i][j] = column[i][(rand + j) % count]
            }
        }

        if (TestGetResult.first) {
            for (var i = 0; i < Common.NUMBER_OF_COLUMN; i++) {
                for (var j = 0; j < Common.NUMBER_OF_ROW; j++) {
                    DataManager.getInstance().result[i][j] = DataManager.getInstance().resultReal[i][j] = TestGetResult.firstData[0][i][j];
                }
            }
            TestGetResult.first = false;
        }

        let scatterCount = 0;
        for (let i = 0; i < DataManager.getInstance().symbolCount; i++) {
            let element = i;
            let lineWin = 0;
            let waysCount = 1;
            let waysCountArr = [0, 0, 0, 0, 0, 0];
            let wayPos = [];

            for (let j = 0; j < Common.NUMBER_OF_COLUMN; j++) {
                for (let k = 0; k < Common.NUMBER_OF_ROW; k++) {
                    let ele = DataManager.getInstance().resultReal[j][k]

                    if (ele == element || ele == Common.wildSymbol) {
                        waysCountArr[j]++;
                        wayPos.push(j * 5 + k);
                    }
                }

                if (waysCountArr[j] <= 0) break;

                waysCount = waysCountArr[j] * waysCount;
            }

            if (waysCountArr[0] > 0 && waysCountArr[1] > 0 && waysCountArr[2] > 0 && waysCountArr[3] > 0 && waysCountArr[4] > 0) {
                lineWin = this.ratio[element][4] * Common.baseBet[DataManager.getInstance().betIndex - 1] * waysCount;
            } else if (waysCountArr[0] > 0 && waysCountArr[1] > 0 && waysCountArr[2] > 0 && waysCountArr[3] > 0) {
                lineWin = this.ratio[element][3] * Common.baseBet[DataManager.getInstance().betIndex - 1] * waysCount;
            } else if (waysCountArr[0] > 0 && waysCountArr[1] > 0 && waysCountArr[2] > 0) {
                lineWin = this.ratio[element][2] * Common.baseBet[DataManager.getInstance().betIndex - 1] * waysCount;
            }

            if (lineWin > 0) {
                DataManager.getInstance().winLine.push({
                    symbol: element,
                    win: lineWin
                });
                DataManager.getInstance().winLineNum.push(wayPos);

                DataManager.getInstance().winMoney = DataManager.getInstance().winMoney + lineWin;

                if (element == Common.scatterSymbol)
                    scatterCount = wayPos.length;
            }
        }

        DataManager.getInstance().SCANum = scatterCount;

        if (DataManager.getInstance().free) {
            if (DataManager.getInstance().SCANum >= 3) {
                DataManager.getInstance().moreFreeSpin = 6;
                DataManager.getInstance().totalFreeSpins += DataManager.getInstance().moreFreeSpin;
            }
        } else {
            if (DataManager.getInstance().SCANum >= 3) {
                DataManager.getInstance().nextFree = 6;
                DataManager.getInstance().totalFreeSpins = 6;
            }
        }

        DataManager.getInstance().jackpots = {};

        if (this.isJackpot) {
            let jackpotType = Math.floor(Math.random() * 4);
            let jackpotWin = this.jackTypes[jackpotType] * Common.baseBet[DataManager.getInstance().betIndex - 1];
            DataManager.getInstance().winMoney = DataManager.getInstance().winMoney + jackpotWin;

            let tempJackTypes = [0, 0, 0, 0];
            let jackpotArray = [];

            do {
                let tempJackType = Math.floor(Math.random() * 4);

                if (tempJackType != jackpotType && tempJackTypes[tempJackType] == 2) continue;

                tempJackTypes[tempJackType]++;

                jackpotArray.push(tempJackType);
            } while (tempJackTypes[jackpotType] < 3);


            DataManager.getInstance().jackpots = {
                jackpotWin: jackpotWin,
                jackpotType: jackpotType,
                jackpotSelects: jackpotArray.join('|')
            };
        }
    }
}
