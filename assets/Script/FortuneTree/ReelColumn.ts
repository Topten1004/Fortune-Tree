// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Common } from "../Common/Common";
import { Sound } from "../Common/Sound";
import { DataManager } from "./DataManager";
import Symbol from "./Symbol";
import FuflyAnimator from "./FuFlyAnimator";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ReelColumn extends cc.Component {
    @property(cc.Prefab)
    item: cc.Prefab = null;

    @property(cc.Integer)
    num = 0;

    @property(cc.Prefab)
    FuFlyPrefab: cc.Prefab = null;

    @property(cc.Node)
    FuFlyParent: cc.Node = null;

    public static eStatus = { Idle: 1, run: 2, stopping: 3, ease: 4, stop: 5 }

    private eleTextures: cc.Node[] = [];

    status: number = 0;
    stopIndex: number = 0;
    bottom: number = 1;
    top: number = Common.REEL_CONTENT_HEIGHT;
    easeAct: cc.Tween[] = [];
    startAct: cc.Tween[] = [];
    curSpeed: number = 1;
    speed: number = Common.speed;
    freeEleSound: boolean = false;
    stopcolindex: number = 0;
    showGray: boolean = false;
    changePic: boolean = false;
    isSet: boolean = false;

    column: number[] = [];
    count: number = 0;
    win: number[] = [];
    nodes: cc.Node[] = [];
    columnID: -1;
    isfirstturn: boolean = true;
    bstopNow: boolean = false;
    eleMixBg: [];
    sprAcer: [];
    /** reelSymbols store all reel items */
    reelSymbols: cc.Node[] = [];
    onLoad() {
        this.status = ReelColumn.eStatus.Idle;
        this.stopIndex = 0;
        this.bottom = 1;
        this.reelSymbols = [];
        this.easeAct = [];
        this.startAct = [];
        this.eleMixBg = [];
        this.sprAcer = [];
        this.nodes = [];
        this.curSpeed = 1;
        this.speed = Common.REEL_SPEED;
        this.freeEleSound = false;
        this.showGray = false;
        this.changePic = false;
        this.isSet = false;

        this.load();
        this.init();
    }

    start() {

    }
    public load() {
        for (let i = 0; i < Common.REEL_SYMBOLS_COUNT; i++) {
            const reelSymbol = cc.instantiate(this.item);
            const symbolInfo = reelSymbol.getComponent(Symbol);
            symbolInfo.init(i);

            this.eleTextures[Common.eleIndex[i]] = reelSymbol;
        }
    }

    public init() {
        this.column = Common.REEL_DATA[this.num];
        this.count = this.column.length;
        this.win = [];
        this.bottom = Common.findRandom(1, this.count - 3);

        for (let i = 3; i >= 0; i--) {
            this.win[i] = this.getIndex(i);
            this.nodes[i] = new cc.Node;
            let symbol = cc.instantiate(this.eleTextures[this.win[i]]);
            symbol.getComponent(Symbol).resetItem(this.win[i]);
            this.nodes[i].addChild(symbol, 0, "component");

            this.nodes[i].position = new cc.Vec3(Common.ELEMENT_WIDTH / 2, Common.ELEMENT_HEIGHT * i + Common.ELEMENT_HEIGHT / 2);
            this.node.addChild(this.nodes[i]);

            let move_ease_in = cc.tween().by(0.05, { position: { value: cc.v3(0, -30), easing: 'sineOut' } })
            let move_ease_in_back = cc.tween().by(0.05, { position: { value: cc.v3(0, 30), easing: 'sineIn' } })
            this.easeAct[i] = cc.tween().sequence(move_ease_in, move_ease_in_back);

            this.startAct[i] = cc.tween().by(0.3, { position: { value: cc.v3(0, 100), easing: 'sineOut' } });
        }
    }
    public run(speedup) {
        if (this.status == ReelColumn.eStatus.Idle) {
            this.stopIndex = 0;

            this.nodes[3].active = true;
            let index = this.getIndex(3);

            this.nodes[3].position = new cc.Vec3(Common.ELEMENT_WIDTH / 2, -Common.ELEMENT_HEIGHT / 2)
            this.nodes[3].getChildByName("component").getComponent(Symbol).resetItem(index);

            for (let i = 0; i < 3; i++) {
                this.nodes[i].active = true;
            }

            this.status = ReelColumn.eStatus.run;
        }

        this.speed = Common.REEL_SPEED;
    }

    public setChangePic(isChange) {
        if (this.isSet) return;
        this.isSet = true;
        this.changePic = isChange;
        this.stopIndex = 0;
        this.status = ReelColumn.eStatus.stopping;
        this.node.stopAllActions();
    }

    public getMinY() {
        return this.nodes[0].position.y;
    }

    public stop(freeEleSound, gray, result, changePic) {
        if (this.status == ReelColumn.eStatus.run || (this.status == ReelColumn.eStatus.stopping && changePic)) {
            this.status = ReelColumn.eStatus.stopping;
            this.freeEleSound = freeEleSound;
            this.showGray = gray;
            this.changePic = changePic;
            this.setResult(result);
        }
    }

    public doStop() {
        for (let i = 0; i < 4; i++) {
            cc.tween(this.nodes[i]).then(this.easeAct[i]).start()
        }
        Sound.getInstance().playEffect(Common.s_sound.StopReel, false, true)
        this.status = ReelColumn.eStatus.ease
    }

    public speedUp() {
        this.speed = Common.REEL_SPEED_Up
    }

    public setResult(result) {
        this.win = result;

        for (let i = 0; i < 3; i++) {
            if (result[i] == Common.wildSymbol) {
                const FuFlyObj = cc.instantiate(this.FuFlyPrefab);
                FuFlyObj.getComponent(FuflyAnimator).startingPos = new cc.Vec2(this.nodes[i].getPosition().x + this.num * Common.XDIFF, this.nodes[i].getPosition().y);

                this.FuFlyParent.addChild(FuFlyObj);
            }
        }
    }
    public setPic(result) {
        this.win = result
        for (let i = 0; i < 3; i++) {
            this.nodes[i].getChildByName("component").getComponent(Symbol).resetItem(result[i]);
        }
    }
    public reset() {
        this.curSpeed = 1
        this.status = ReelColumn.eStatus.Idle
        this.showGray = false
        this.changePic = false
        this.isSet = false
    }

    public getStatus() {
        return this.status;
    }

    public getNodes() {
        return this.nodes;
    }

    public getIndex(pos) {
        var p = pos + this.bottom;
        if (p >= this.count) {
            p = p - this.count
        } else {
            p = this.count - p
        }
        return this.column[p];
    }

    public setFreeColumn(columnType: number) {
        if (columnType == 2) {
            // console.log("---ReelColumn free id : " + DataManager.getInstance().freeType);
            switch (DataManager.getInstance().freeType) {
                case 0:
                    this.column = Common.FREE_REEL_DATA1[this.num];
                    break;
                case 1:
                    this.column = Common.FREE_REEL_DATA2[this.num];
                    break;
                case 2:
                    this.column = Common.FREE_REEL_DATA3[this.num];
                    break;
                case 3:
                    this.column = Common.FREE_REEL_DATA4[this.num];
                    break;
                case 4:
                    this.column = Common.FREE_REEL_DATA5[this.num];
                    break;
            }

        } else {
            this.column = Common.REEL_DATA[this.num];
        }

        this.count = this.column.length
    }

    public tick() {
        let toStop = false
        let diff = 0

        if (this.status == ReelColumn.eStatus.run || this.status == ReelColumn.eStatus.stopping) {
            this.curSpeed = this.curSpeed + 50;

            if (this.curSpeed > this.speed) this.curSpeed = this.speed;

            for (let i = 0; i < 4; i++) {
                let y = this.nodes[i].position.y;
                y = y - this.curSpeed;

                if (y < -Common.ELEMENT_HEIGHT / 2) {
                    let d = y + 4 * Common.ELEMENT_HEIGHT;
                    let n = d - Math.floor(d);

                    if (n >= 0) y = Math.floor(d);
                    else y = Math.floor(d + 1);

                    this.bottom = this.bottom + 1;
                    if (this.bottom > this.count - 1) this.bottom = 0;
                    let index = this.getIndex(3);
                    this.nodes[i].getChildByName("component").getComponent(Symbol).resetItem(index);
                    if (this.status == ReelColumn.eStatus.stopping) {
                        if (this.changePic || this.showGray) {
                            for (var j = 0; j < 3; j++) {
                                this.nodes[j + 1].getChildByName("component").getComponent(Symbol).resetItem(this.win[this.stopIndex]);
                                this.stopIndex = this.stopIndex + 1;
                                diff = Common.REEL_CONTENT_HEIGHT - y;
                                toStop = true;
                            }
                        } else {
                            if (this.stopIndex < 3) {
                                this.nodes[i].getChildByName("component").getComponent(Symbol).resetItem(this.win[this.stopIndex]);
                                this.stopIndex = this.stopIndex + 1;
                            } else {
                                diff = Common.REEL_CONTENT_HEIGHT - y;
                                toStop = true;
                            }
                        }
                    }
                }

                this.nodes[i].position = new cc.Vec3(Common.ELEMENT_WIDTH / 2, y);
            }
        } else if (this.status == ReelColumn.eStatus.ease) {
            for (let i = 0; i < 3; i++) {
                this.nodes[i].getChildByName("component").getComponent(Symbol).resetItem(this.win[i]);
            }
            this.status = ReelColumn.eStatus.stop;
            return true;
        } else return false;

        this.nodes.sort(function (a, b) {
            if (a.position.y > b.position.y) {
                return 1
            }
            if (a.position.y < b.position.y) {
                return -1
            }
            return 0
        });

        if (toStop) {
            for (let i = 0; i < 4; i++) {
                this.nodes[i].position = new cc.Vec3(Common.ELEMENT_WIDTH / 2, Common.ELEMENT_HEIGHT * i + Common.ELEMENT_HEIGHT / 2);
            }
            this.doStop();
        }
        return false;
    }

    public leave() {
    }
}
