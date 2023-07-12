const { ccclass, property } = cc._decorator;

@ccclass
export class DataManager {
    public money = 0;
    public lastBetIndex = 4;
    public betIndex = 1;
    public coinIndex = 1;
    public totalBet = 0;
    public betEnable = false;
    public SCANum = 0;
    public winMoney = 0;
    public winShow = 0;
    public symbolCount = 13;
    public result = [[6, 5, 4], [3, 8, 10], [8, 5, 6], [10, 8, 6], [10, 3, 6]];
    public resultReal = [[6, 5, 4], [3, 8, 10], [8, 5, 6], [10, 8, 6], [10, 3, 6]];
    public winLine = [];
    public winLineNum = [];
    public free = false;
    public freeType = 0; //0 : 88, 1 : 98, 2 : 108, 3 : 118, 4 : 128
    public nextFree = 0;
    public totalFreeSpins = 0;
    public moreFreeSpin = 0;
    public jackpots = null;
    public isCanReset = true;
    public auto = false;
    public playEnd = true;
    public received = false;
    public status = 0;
    public isBigWin = false;
    public overgame = false;
    public winTotalFreeMoney = 0;
    public autoNum = 0;
    public isAutoOnWin = false;
    public isAutoFreeSpin = false;
    private static _instance: DataManager = null;
    public static getInstance(): DataManager {
        if (DataManager._instance == null) {
            DataManager._instance = new DataManager();
        }

        return DataManager._instance;
    }

    public isOpen = false;
}
