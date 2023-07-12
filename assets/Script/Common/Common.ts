const { ccclass, property } = cc._decorator;

@ccclass
export class Common {
  public static REEL_DATA = [
    [11, 5, 4, 4, 5, 10, 2, 2, 2, 3, 11, 5, 5, 5, 8, 3, 3, 3, 7, 12, 1, 1, 1, 12, 6, 5, 7, 4, 8, 2, 2, 5, 7, 3, 5, 4, 10, 3, 4, 6, 5, 4, 4, 4, 5, 9],
    [7, 1, 1, 1, 11, 3, 3, 3, 4, 4, 4, 0, 1, 6, 3, 3, 5, 9, 7, 12, 2, 2, 2, 5, 5, 5, 6, 4, 10, 3, 8, 12, 5, 4, 8, 0, 10, 1, 1, 9, 4, 7, 5, 4, 6, 5, 0, 3, 7, 5, 12, 4, 3],
    [6, 3, 0, 9, 11, 3, 3, 5, 5, 4, 4, 4, 5, 11, 2, 2, 2, 0, 5, 7, 3, 12, 10, 4, 4, 3, 3, 3, 12, 2, 3, 3, 10, 4, 5, 6, 4, 11, 5, 6, 4, 5, 5, 5, 7, 2, 0, 7, 9, 3, 8, 1, 1, 1],
    [11, 4, 4, 3, 12, 1, 5, 5, 5, 12, 6, 9, 0, 10, 8, 5, 7, 3, 3, 3, 11, 4, 4, 10, 6, 2, 11, 0, 5, 7, 3, 10, 2, 2, 2, 11, 5, 1, 1, 1, 12, 6, 7, 3],
    [3, 8, 2, 2, 2, 11, 10, 12, 1, 1, 1, 12, 9, 5, 10, 8, 3, 11, 6, 2, 9, 6, 1, 10, 8, 5, 5, 5, 11, 6, 1, 7, 10, 2, 8, 7, 4, 4, 4, 6, 3, 3, 3, 5, 7, 3, 6]
  ];

  //when 88 selected
  public static FREE_REEL_DATA1 = [
    [1, 9, 1, 7, 7, 7, 1, 8, 8, 8, 1, 1, 1, 11, 11, 11, 1, 1, 6, 6, 6, 12, 11, 11, 1, 1, 6, 6, 6, 12, 10, 10, 10, 1, 11, 11, 1, 8, 8, 8, 1, 10, 10, 10, 1, 6, 6, 1, 8, 8, 8, 1, 9, 9, 9, 1],
    [0, 10, 10, 10, 1, 7, 7, 1, 7, 7, 7, 1, 8, 8, 8, 1, 9, 9, 0, 6, 6, 6, 1, 1, 11, 11, 1, 10, 12, 8, 8, 12, 8, 8, 1, 6, 6, 12, 10, 10, 1, 1, 1, 9, 9, 9, 1, 8, 8, 1, 1, 6, 6, 6],
    [1, 7, 7, 1, 6, 6, 6, 0, 10, 10, 10, 1, 1, 11, 11, 11, 0, 8, 8, 8, 1, 1, 9, 9, 12, 6, 6, 1, 10, 10, 7, 12, 9, 9, 7, 1, 1, 8, 8, 8, 1, 11, 11, 11, 1, 1, 1, 7, 7, 1, 1, 8, 7, 7, 1, 7, 7, 1, 8, 8, 8, 1],
    [1, 8, 8, 8, 1, 1, 1, 6, 6, 6, 1, 1, 7, 7, 7, 1, 8, 8, 0, 8, 8, 1, 1, 11, 11, 11, 1, 10, 1, 1, 7, 7, 12, 11, 11, 11, 1, 9, 9, 9, 1, 8, 8, 1, 1, 7, 9, 12, 6, 6, 0, 9, 9, 1, 10, 10, 10, 1],
    [1, 8, 8, 1, 10, 10, 10, 1, 1, 8, 8, 8, 12, 7, 7, 7, 1, 1, 9, 9, 9, 12, 7, 7, 7, 1, 9, 9, 9, 1, 1, 1, 11, 11, 11, 1, 7, 7, 1, 10, 10, 10, 1, 1, 8, 8, 8, 12, 6, 6, 11]
  ];

  //when 98 selected
  public static FREE_REEL_DATA2 = [
    [2, 2, 7, 7, 2, 6, 6, 2, 2, 2, 11, 11, 2, 2, 8, 8, 8, 12, 8, 8, 2, 2, 8, 8, 8, 12, 10, 10, 2, 7, 7, 2, 6, 6, 2, 2, 11, 11, 2, 6, 6, 2, 9, 9, 2, 6, 6, 2, 6, 6, 2, 7, 7],
    [2, 2, 7, 7, 0, 7, 7, 2, 8, 8, 2, 2, 10, 10, 2, 2, 11, 11, 12, 8, 8, 12, 6, 6, 2, 8, 8, 12, 7, 2, 2, 2, 9, 9, 2, 9, 9, 0, 6, 2, 2, 7, 7, 7, 2, 6, 2, 11, 11],
    [2, 7, 7, 0, 8, 8, 2, 10, 10, 0, 10, 10, 2, 2, 9, 9, 2, 6, 6, 2, 6, 6, 6, 2, 7, 7, 2, 11, 11, 12, 6, 6, 2, 10, 10, 12, 9, 9, 2, 2, 6, 6, 6, 2, 8, 8, 8, 2, 2, 2, 7, 7, 2, 2, 11, 11, 2, 7, 7, 7, 2],
    [2, 10, 10, 10, 2, 2, 2, 8, 8, 8, 2, 7, 7, 0, 7, 7, 2, 6, 6, 2, 6, 6, 2, 2, 8, 8, 0, 11, 11, 2, 10, 10, 10, 2, 2, 2, 11, 11, 2, 7, 7, 12, 11, 11, 2, 7, 7, 2, 11, 11, 2, 6, 6, 6, 2, 9, 9, 9, 12, 2, 2, 6, 8],
    [2, 2, 10, 10, 10, 2, 2, 11, 11, 2, 12, 7, 7, 7, 2, 2, 8, 8, 2, 9, 9, 12, 7, 7, 7, 2, 9, 9, 2, 2, 2, 11, 11, 2, 6, 6, 2, 11, 11, 2, 8, 8, 2, 6, 6, 2, 6, 12, 8, 8]
  ];

  //when 108 selected
  public static FREE_REEL_DATA3 = [
    [3, 3, 7, 7, 3, 9, 9, 3, 3, 3, 11, 11, 3, 3, 8, 3, 8, 8, 12, 8, 8, 3, 3, 8, 8, 8, 12, 10, 10, 3, 7, 7, 3, 9, 9, 3, 10, 10, 3, 11, 11, 3, 6, 6, 3, 6, 6, 3, 9, 9, 3, 9, 9, 3, 7, 7, 3, 9, 3, 9],
    [3, 3, 7, 7, 0, 7, 7, 3, 8, 8, 3, 9, 9, 3, 3, 10, 10, 3, 3, 11, 11, 3, 11, 12, 8, 8, 12, 9, 9, 3, 8, 8, 12, 10, 3, 3, 3, 6, 6, 3, 9, 9, 0, 10, 3, 9, 9, 3, 7, 7, 7, 3, 3, 11, 11, 3, 10, 10, 3, 6, 6],
    [3, 7, 7, 7, 0, 8, 8, 8, 3, 10, 10, 0, 10, 10, 3, 3, 6, 6, 3, 11, 11, 3, 9, 9, 9, 3, 3, 11, 11, 12, 9, 9, 3, 10, 10, 12, 6, 6, 3, 3, 9, 9, 9, 3, 8, 8, 3, 8, 3, 3, 3, 7, 7, 3, 3, 3, 7, 3, 10, 10, 3, 11, 11, 3, 3, 10],
    [3, 10, 10, 10, 3, 3, 3, 8, 8, 8, 3, 7, 7, 0, 7, 7, 3, 9, 9, 9, 3, 9, 9, 3, 3, 8, 8, 0, 11, 11, 3, 3, 6, 6, 6, 3, 3, 11, 11, 3, 3, 7, 12, 11, 11, 3, 6, 6, 3, 3, 9, 9, 9, 3, 6, 6, 6, 12, 8, 8, 8, 3, 10, 10, 3, 9, 9, 3],
    [3, 3, 10, 10, 3, 6, 6, 3, 9, 9, 12, 7, 7, 7, 3, 3, 8, 9, 3, 6, 6, 12, 3, 11, 11, 3, 6, 6, 3, 3, 3, 11, 11, 3, 9, 9, 3, 3, 8, 8, 3, 9, 9, 3, 12, 8, 8, 3, 9, 9, 3, 7, 7, 3, 9, 9, 3]
  ];

  //when 118 selected
  public static FREE_REEL_DATA4 = [
    [4, 4, 8, 8, 4, 4, 11, 4, 4, 4, 6, 6, 4, 8, 4, 4, 8, 8, 12, 11, 11, 4, 4, 8, 8, 8, 12, 10, 10, 4, 7, 7, 4, 4, 10, 10, 4, 6, 6, 4, 4, 9, 9, 4, 4, 11, 4, 11, 11, 4, 4, 11, 11, 4, 10],
    [4, 4, 7, 0, 7, 7, 4, 8, 8, 4, 11, 11, 4, 9, 9, 4, 10, 10, 4, 9, 9, 4, 6, 6, 4, 6, 12, 4, 11, 4, 8, 8, 12, 7, 4, 4, 4, 7, 7, 4, 12, 4, 11, 0, 11, 4, 4, 7, 7, 7, 4, 4, 6, 6, 4, 11, 11, 11, 4, 9],
    [4, 7, 7, 0, 7, 4, 8, 8, 4, 10, 10, 0, 10, 10, 4, 11, 11, 4, 4, 6, 6, 4, 11, 4, 11, 4, 4, 11, 11, 12, 4, 11, 4, 10, 10, 12, 9, 9, 4, 4, 9, 9, 9, 4, 4, 8, 8, 4, 4, 4, 7, 7, 4, 4, 6, 6, 4, 10, 4, 7, 4, 6, 6, 4, 11, 4, 9],
    [10, 4, 10, 10, 4, 4, 4, 8, 8, 8, 4, 7, 7, 0, 7, 7, 4, 11, 11, 11, 4, 8, 4, 4, 8, 8, 0, 6, 6, 4, 10, 10, 10, 4, 4, 11, 11, 4, 6, 6, 4, 7, 7, 12, 6, 6, 4, 9, 9, 4, 6, 6, 4, 4, 9, 9, 4, 11, 11, 4, 11, 12, 4, 8, 4, 4, 11, 11, 4, 7],
    [4, 4, 10, 10, 4, 9, 9, 4, 4, 11, 11, 12, 7, 7, 7, 4, 10, 4, 8, 8, 4, 9, 9, 12, 7, 7, 4, 9, 9, 4, 4, 4, 6, 6, 4, 11, 11, 4, 4, 8, 8, 4, 4, 6, 4, 11, 11, 12, 8, 8, 4, 11, 11, 4, 7, 7, 4, 4, 10, 8]
  ];

  //when 128 selected
  public static FREE_REEL_DATA5 = [
    [5, 9, 9, 5, 7, 5, 5, 6, 5, 5, 5, 11, 11, 5, 7, 5, 5, 8, 12, 8, 8, 5, 5, 8, 8, 8, 12, 10, 10, 5, 7, 7, 5, 5, 6, 5, 10, 10, 5, 11, 11, 5, 5, 9, 5, 5, 6, 5, 5, 5, 7, 7, 5, 6, 6, 5, 10],
    [5, 10, 10, 5, 8, 0, 7, 7, 5, 8, 5, 5, 10, 5, 9, 9, 5, 5, 10, 5, 8, 8, 5, 11, 11, 5, 11, 12, 5, 8, 5, 8, 12, 7, 5, 5, 5, 9, 5, 12, 5, 5, 9, 9, 0, 10, 5, 5, 7, 5, 5, 11, 11, 5, 6, 6, 6, 5, 5, 9],
    [5, 7, 7, 0, 6, 5, 8, 5, 10, 10, 0, 10, 10, 5, 5, 6, 5, 9, 9, 5, 11, 5, 6, 5, 7, 7, 5, 11, 11, 12, 5, 6, 5, 10, 10, 12, 5, 9, 5, 5, 6, 6, 6, 5, 8, 8, 5, 8, 5, 5, 5, 7, 5, 5, 11, 5, 10],
    [5, 10, 10, 5, 5, 5, 8, 5, 7, 7, 0, 7, 7, 5, 6, 6, 6, 5, 8, 5, 5, 8, 8, 0, 11, 11, 5, 10, 5, 9, 5, 5, 6, 5, 11, 5, 7, 12, 5, 9, 9, 5, 11, 11, 5, 6, 5, 7, 5, 5, 9, 12, 6, 5],
    [5, 5, 10, 10, 5, 9, 5, 5, 6, 12, 7, 7, 7, 5, 6, 5, 9, 5, 8, 8, 12, 9, 9, 5, 7, 5, 5, 5, 11, 5, 5, 6, 5, 11, 11, 5, 5, 6, 6, 5, 11, 11, 12, 8, 5, 8, 5, 6, 5, 7, 5, 10]
  ];

  public static CURRENT_GAME_NAME = "FortuneTree";
  public static CURRENT_GAME_LANGUAGE = "En";

  public static NUMBER_OF_ROW: number = 3;
  public static NUMBER_OF_COLUMN: number = 5;

  // set the amount of the Y translation that define the reel motion
  public static REEL_SPEED = 60;
  public static REEL_SPEED_Up = 10;

  // set number of items will comes in a reel 
  public static REEL_SYMBOLS_COUNT = 16;
  public static BETLINE_COUNT = 25;
  public static XDIFF = 137;
  public static REEL_CONTENT_HEIGHT = 360;

  public static ELEMENT_WIDTH = 130;
  public static ELEMENT_HEIGHT = 114;
  public static REALMONEY_ODD = 1;
  public static eleIndex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  public static addCoinTime = 2;
  public static firstStopTime = 1.25;
  public static stopTime = 0.25;
  public static speedUpTime = 1.5;
  public static singleStopTime = 2.0;
  public static elapse = 0;
  public static scatterSymbol = 12;
  public static wildSymbol = 0;

  public static baseBet = [90, 180, 300, 600, 900, 1200, 1500, 1800, 3000, 3600, 4500, 6000, 15000, 22500];//[0.01,0.02,0.03,0.04,0.05,0.1,0.2,0.5,1];
  public static baseCoin = [88];
  public static changePic = true;
  public static lineCount = 25;
  public static speed = 60
  public static eStatus = { Idle: 0, Running: 1, Win: 2, Wait: 3, FreeSpin: 4, Respin: 5, Prize: 6 };
  public static CustomEvent = {
    EventStartRoll: "EventStartRoll",
    EventStartAll: "EventStartAll",
    EventStopRoll: "EventStopRoll",
    EventStopAutoResult: "EventStopAutoResult",
    EventStopFreeResult: "EventStopFreeResult",
    EventStopRespinResult: "EventStopRespinResult",
    EventExit: "EventExit"
  };

  public static BigWinOdd = [5, 10, 20, 40, 100];
  public static addCoinTimeFree = 2
  public static nomalWinDelayTime = 1.8
  public static addCoinDiffMin = 0.02
  public static addCoinDiffMax = 1000

  public static s_sound = {
    AllButton: 0,
    MainBG: 1,
    FreeBG: 2,
    BtnSound: 3,
    BtnStop: 4,
    GambleWin: 5,
    ScatterReelAnim: 6,
    StopReel: 7,
    RealScatter: 8,
    LineWin_1: 9,
    LineWin_2: 10,
    LineWin_3: 11,
    LineWin_4: 12,
    LineWin_5: 13,
    FuFly_Pick: 14,
    Tree_Shaking: 15,
    FGPick: 16
  }
  public static shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }


  /**
   * find rendom value 
   * @param min random start from min
   * @param max to max 
   */
  public static findRandom(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  public static addComma(value: number) {
    value = Math.floor(value);

    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  public static addComma2Digits(value: number) {
    value = value * 1.0;

    let decimal = value - Math.floor(value);

    if (decimal.toFixed(2) == '0.00')
      return this.addComma(value);

    return value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  public static getBetIndex(currentBet) {
    currentBet = Math.floor(currentBet * 10000 + 0.005);
    for (var j = 0; j < Common.baseBet.length; j++) {
      if (currentBet == Math.floor(Common.baseBet[j] * 10000)) {
        return j;
      }
    }
    return 0;
  }

  public static randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
