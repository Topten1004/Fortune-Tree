import BtnTouchListener from "../Common/BtnTouchListener";
import { Common } from "../Common/Common";
import HttpClient from "../Network/HttpClient";
import { DataManager } from "./DataManager";
import GameScene from "./GameScene";

const { ccclass, property } = cc._decorator;

@ccclass
export class NetTrans {
    public static first: boolean = true
    public static waitFree: boolean = false

    private static mainScene: GameScene = null;

    public static onCommand(pObj) {
        if (pObj.responseType == "getSettings") {
            NetTrans.onGameSetting(pObj.serverResponse);
        } else if (pObj.responseType == "restart") {
            NetTrans.onRestart(pObj.serverResponse);
        } else if (pObj.responseType == "bet" || pObj.responseType == "freespin") {
            NetTrans.onResultInfo(pObj.serverResponse);
        }
    }

    public static onGameSetting(serverResponse) {
        let strBetAmounts = serverResponse.BetAmounts;
        let currentBet = serverResponse.CurrentBet;
        let money = serverResponse.Balance;
        let totalFree = serverResponse.FreeGames;
        let currentFreeGame = serverResponse.CurrentFreeGame;
        let bonusWin = serverResponse.BonusWin;
        let selectedDragon = serverResponse.SelectedDragon;
        DataManager.getInstance().winMoney = bonusWin;
        DataManager.getInstance().freeType = selectedDragon;
        DataManager.getInstance().totalFreeSpins = totalFree;
        let freeGameNum = totalFree - currentFreeGame;
        DataManager.getInstance().nextFree = freeGameNum;
        for (var i = 0; i < Common.NUMBER_OF_COLUMN; i++) {
            DataManager.getInstance().result[i] = []
            DataManager.getInstance().resultReal[i] = []
            for (var j = 0; j < Common.NUMBER_OF_ROW; j++) {
                DataManager.getInstance().result[i][j] = Number(serverResponse.reelSymbols['reel' + (i + 1)][2 - j])
                DataManager.getInstance().resultReal[i][j] = DataManager.getInstance().result[i][j]
            }
        }

        let betAmounts = strBetAmounts.split('|');

        Common.baseBet = betAmounts.map(amount => Number(amount));

        let betIndexes = Common.getBetIndex(currentBet);
        DataManager.getInstance().coinIndex = 1;
        DataManager.getInstance().betIndex = betIndexes + 1;

        DataManager.getInstance().money = money;
        DataManager.getInstance().totalBet = Common.baseBet[DataManager.getInstance().betIndex - 1] * Common.baseCoin[0];
        cc.director.loadScene('GameScene');
    }

    public static onRestart(serverResponse) {
        let totalFree = serverResponse.FreeGames;
        let currentFreeGame = serverResponse.CurrentFreeGame;
        DataManager.getInstance().totalFreeSpins = totalFree;
        let freeGameNum = totalFree - currentFreeGame;
        DataManager.getInstance().nextFree = freeGameNum;

        if (NetTrans.mainScene != null && DataManager.getInstance().isOpen == true) {
            NetTrans.mainScene.onOverGame();
        }
    }

    public static onResultInfo(serverResponse) {
        let jackpots = serverResponse.Jackpots;
        DataManager.getInstance().SCANum = serverResponse.scaCount;
        DataManager.getInstance().winMoney = jackpots.jackpotWin && jackpots.jackpotWin > 0 ? serverResponse.totalWin - jackpots.jackpotWin : serverResponse.totalWin;
        let totalFreeGame = serverResponse.totalFreeGames;
        let currentFreeGame = serverResponse.currentFreeGames;
        DataManager.getInstance().nextFree = totalFreeGame - currentFreeGame;
        DataManager.getInstance().totalFreeSpins = totalFreeGame;
        DataManager.getInstance().moreFreeSpin = serverResponse.MoreFreeSpin;
        DataManager.getInstance().jackpots = jackpots;
        if (DataManager.getInstance().nextFree < 0) {
            DataManager.getInstance().nextFree = 0
        }

        if ((DataManager.getInstance().totalFreeSpins > 0 && DataManager.getInstance().nextFree == DataManager.getInstance().totalFreeSpins) ||
            (DataManager.getInstance().moreFreeSpin > 0) ||
            (DataManager.getInstance().free && DataManager.getInstance().nextFree == 0 && DataManager.getInstance().moreFreeSpin == 0)) {
            this.mainScene.m_BtnSpin.getComponent(BtnTouchListener).interactable = false;
        }

        for (var i = 0; i < Common.NUMBER_OF_COLUMN; i++) {
            DataManager.getInstance().result[i] = []
            DataManager.getInstance().resultReal[i] = []
            for (var j = 0; j < Common.NUMBER_OF_ROW; j++) {
                DataManager.getInstance().result[i][j] = DataManager.getInstance().resultReal[i][j] = Number(serverResponse.realReelsSymbols['reel' + (i + 1)][2 - j]);
            }
        }

        DataManager.getInstance().winLineNum = [];
        DataManager.getInstance().winLine = [];

        // '&l' . $winLineCount . '=' . $csym . '~' . $cWins[$j] . '~' . implode('~', $wayPos);
        const arrStrResult = serverResponse.winLines.split('&');

        for (var i = 0; i < arrStrResult.length; i++) {
            if (arrStrResult[i] == '') continue;

            const oneSymbolInfo = arrStrResult[i].split('=');
            const winInfo = oneSymbolInfo[1].split('~');

            DataManager.getInstance().winLine.push({
                symbol: winInfo[0],
                win: winInfo[1]
            });
            DataManager.getInstance().winLineNum.push(winInfo.slice(2));
        }

        if (NetTrans.mainScene != null) {
            NetTrans.mainScene.onResult();
        }
    }

    public static sendOverGame() {
        HttpClient.getInstance().ServerConnect({ "SlotEvent": "restart" })
    }

    public static sendStartInfo(fBetPerLine) {
        if (DataManager.getInstance().nextFree > 0) {
            HttpClient.getInstance().ServerConnect({ "SlotEvent": "freespin", "betLine": fBetPerLine });
        } else {
            HttpClient.getInstance().ServerConnect({ "SlotEvent": "bet", "betLine": fBetPerLine });
        }
    }

    public static sendSelectedDragon(selectedDragon) {
        HttpClient.getInstance().ServerConnect({ "SlotEvent": "gambleCard", "choice": selectedDragon })
    }

    public static setMainScene(mainScene: GameScene) {
        // console.log('[NetTrans]--setMainScene');

        NetTrans.mainScene = mainScene;
    }
}
