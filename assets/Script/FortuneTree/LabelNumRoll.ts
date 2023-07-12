const { ccclass, property } = cc._decorator;

let ACTION_TAG_NUM_ROLL = 10101010;

@ccclass
export default class LabelNumRoll extends cc.Label {
    nrCurValue = 0
    nrSecFrame = 1
    digitNum = 0

    deZero = false
    nrParserFunc = null

    nrStartValue = this.nrCurValue
    nrEndValue = 0
    nrStartTime = new Date
    nrPlayDur = 0

    showCallback = null

    nrInit(beginValue, secFrame, parserFunc, digitNum) {
        this.nrCurValue = beginValue
        this.nrSecFrame = secFrame
        this.setParserFunc(parserFunc)
        this.digitNum = digitNum || 0
    }

    setDeZero(flag) {
        this.deZero = flag
    }

    setParserFunc(parserFunc) {
        this.nrParserFunc = parserFunc || toString
    }

    nrStartRoll(beginValue, endValue, playDur) {
        let self = this;

        if (beginValue) this.nrCurValue = beginValue;

        this.nrStartValue = this.nrCurValue;
        this.nrEndValue = endValue;
        this.nrStartTime = new Date;
        this.nrPlayDur = playDur;

        if (this.node.getActionByTag(ACTION_TAG_NUM_ROLL)) return;


        let action = cc.repeatForever(cc.sequence(
            cc.delayTime(1 / this.nrSecFrame),
            cc.callFunc(function () {
                if (self.nrCurValue == self.nrEndValue || self.nrEndValue == null) return;

                let nowTime = new Date;
                let duration = nowTime.getTime() - self.nrStartTime.getTime();
                self.nrCurValue = self.nrStartValue + (self.nrEndValue - self.nrStartValue) * duration / self.nrPlayDur
                if (self.nrCurValue >= 100) {
                    if (self.digitNum == 0) {
                        self.nrCurValue = (Math.floor(self.nrCurValue * Math.pow(10, self.digitNum))) / Math.pow(10, self.digitNum)
                        self.nrCurValue = Math.floor(self.nrCurValue)
                    } else {
                        self.nrCurValue = Math.floor(self.nrCurValue * (10 ^ self.digitNum))
                        self.nrCurValue = (self.nrCurValue * Math.pow(10, self.digitNum)) / Math.pow(10, self.digitNum)
                        self.nrCurValue = self.nrCurValue / (10 ^ self.digitNum)
                    }
                } else {
                    if (self.digitNum == 0) {
                        self.nrCurValue = (Math.floor(self.nrCurValue * Math.pow(10, self.digitNum))) / Math.pow(10, self.digitNum)
                    } else {
                        self.nrCurValue = Math.floor(self.nrCurValue * (10 ^ self.digitNum))
                        self.nrCurValue = (self.nrCurValue * Math.pow(10, self.digitNum)) / Math.pow(10, self.digitNum)
                        self.nrCurValue = self.nrCurValue / (10 ^ self.digitNum)
                    }
                }

                if (duration >= self.nrPlayDur) {
                    self.nrStopRoll(true)
                }
                self._showCurValue()
            })));

        action.setTag(ACTION_TAG_NUM_ROLL);
        this.node.runAction(action)
        this._showCurValue()
    }

    nrStopRoll(flush = undefined) {
        if (this.node.getActionByTag(ACTION_TAG_NUM_ROLL)) {
            this.node.stopActionByTag(ACTION_TAG_NUM_ROLL)

            if (flush)
                this.nrCurValue = this.nrEndValue

            this._showCurValue()
        }
    }

    nrGetCurValue() {
        return this.nrCurValue
    }

    nrGetEndValue() {
        return this.nrEndValue
    }

    nrSetCurValue(val) {
        this.nrCurValue = val
        this._showCurValue()
    }

    _showCurValue() {
        if (this.deZero && 0 == this.nrCurValue) {
            this.string = '';
        } else if (this.nrCurValue) {
            this.string = this.nrParserFunc(this.nrCurValue);
        }
        if (this.showCallback) {
            this.showCallback();
        }
    }

    setShowCallback(callback) {
        this.showCallback = callback
    }
}
