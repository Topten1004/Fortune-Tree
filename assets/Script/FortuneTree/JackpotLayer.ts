import LabelNumRoll from "./LabelNumRoll";

const { ccclass, property } = cc._decorator;

@ccclass
export default class JackpotLayer extends cc.Component {
    @property(sp.Skeleton)
    grandBoard: sp.Skeleton = null
    @property(sp.Skeleton)
    majorBoard: sp.Skeleton = null
    @property(sp.Skeleton)
    minorBoard: sp.Skeleton = null
    @property(sp.Skeleton)
    miniBoard: sp.Skeleton = null
    @property(LabelNumRoll)
    jpNumList: LabelNumRoll[] = []
    @property(cc.Node)
    jpNumNode: cc.Node[] = []
    @property(cc.Node)
    jpLoadingList: cc.Node[] = []

    jpNum = 4
    groupNum = 5
    uninitialized = true
    changeGroup = false
    jpLastSendTime = new Date
    jpInterval = 10
    jpLastList = []
    jpCurrentList = []
    isLocked = false

    jpTargetList = []
    jpWin = 0

    updateInterval = 1 / 12
    updateAccumulation = 0

    onLoad() {
        this.jpNum = 4
        this.groupNum = 5
        this.uninitialized = true
        this.changeGroup = false
        this.jpLastSendTime = new Date;
        this.jpInterval = 10
        this.jpLastList = []
        this.jpCurrentList = []
        this.isLocked = false
    }
    reset() {
        this.jpLastSendTime = new Date;

        this.jpTargetList = null
        for (let i = 0; i < this.jpNum; i++) {
            this.jpLoadingList[i].active = true;
            this.jpNumList[i].node.active = false;
        }

        this.uninitialized = true
    }

    update(dt) {
        return;
        this.updateAccumulation = this.updateAccumulation + dt
        if (this.updateAccumulation < this.updateInterval) return;

        this.updateAccumulation = 0

        let currTime = new Date;

        let jpSendInterval = currTime.getTime() - this.jpLastSendTime.getTime();

        if (jpSendInterval >= this.jpInterval) {
            this.jpLastSendTime = currTime
        }

        if (this.jpTargetList != null) {
            if (!this.isLocked) {
                for (let i = 0; i < this.jpNum; i++) {
                    this.jpCurrentList[i] = this.jpTargetList[i]
                }
                this.updateJackpotDisplay()
            }
        }
    }

    updateJackpotDisplay() {
        if (this.uninitialized) {
            for (let i = 0; i < this.jpNum; i++) {
                this.jpLoadingList[i].active = false;
                this.jpNumList[i].node.active = true;
                this.jpLastList[i] = this.jpCurrentList[i];
            }
            this.uninitialized = false;
            return;
        }

        for (let i = 0; i < this.jpNum; i++) {
            if (this.jpLastList[i] != this.jpCurrentList[i]) {
                this.jpLastList[i] = this.jpCurrentList[i];
            }
        }
    }

    onJpCmd(data) {
        this.updateTargetJackpot(data.jp_value)
    }

    updateTargetJackpot(jpValue) {
        if (this.jpTargetList == null)
            this.jpTargetList = [];

        if (jpValue != null) {
            for (let i = 0; i < this.jpNum; i++) {
                this.jpTargetList[i] = Number(jpValue[i]);
            }
        }
    }

    lock(jpType, jpWin, jpValue) {
        this.isLocked = true;
        this.updateTargetJackpot(jpValue)
        for (let i = 0; i < this.jpNum; i++) {
            this.jpCurrentList[i] = this.jpTargetList[i];
        }
        this.jpCurrentList[jpType] = jpWin;

        this.jpWin = jpType
    }

    unlock() {
        if (!this.isLocked) return;

        this.isLocked = false
    }

    refreshUI() {
        this.grandBoard.clearTrack(0);
        this.grandBoard.setAnimation(0, 'Grand_EN', true);

        this.majorBoard.clearTrack(0);
        this.majorBoard.setAnimation(0, 'Major_EN', true);

        this.minorBoard.clearTrack(0);
        this.minorBoard.setAnimation(0, 'Minor_EN', true);

        this.miniBoard.clearTrack(0);
        this.miniBoard.setAnimation(0, 'Mini_EN', true);
    }

    scaleJP() {
        for (let i = 0; i < 4; i++) {
            this.jpNumNode[i].runAction(cc.sequence(
                cc.scaleTo(0.13, 1.2),
                cc.scaleTo(0.13, 1)
            ));
        }
    }

    // by jaison
    manualSetting(data) {
        // console.log('manualSetting', data);

        let self = this;
        this.jpLoadingList.forEach(loadingNode => {
            loadingNode.active = false;
        });
        this.jpNumNode.forEach(numNode => {
            numNode.active = true;
        });

        for (let i = 0; i < this.jpNum; i++) {
            this.jpNumList[i].string = data.jp_value[i];
        }
    }
}
