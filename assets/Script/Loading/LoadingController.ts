// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GlobalData from "../Common/GlobalData";
import HttpClient from "../Network/HttpClient";
import Language from "../Language/Language";
import NodeDialog from "../Common/NodeDialog";
// import LanguageData = require("../../../packages/i18n-master/runtime-scripts/LanguageData");

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.ProgressBar)
    m_ProgressBar: cc.ProgressBar = null;

    @property(NodeDialog)
    m_dialog: NodeDialog = null;

    @property(cc.AudioClip)
    m_loadingSnd: cc.AudioClip = null;

    audio_played = false;

    m_currentLoadingTime: number = 0;
    m_maxLoadingTime: number = 5;
    m_lastLoadingProgress = 0;
    start() {
        GlobalData.G_IsTest = false;
        this.m_ProgressBar.progress = 0;
        this.audio_played = false;

        // language
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        if (urlParams.get('lang') != null && urlParams.get('lang') != "") {
            Language.getInstance().initLang(urlParams.get('lang'));
        }
        HttpClient.getInstance().setDialog(this.m_dialog);

        cc.director.preloadScene('GameScene', (completedCount: number, totalCount: number, item: any) => {
            if (this.m_lastLoadingProgress < (completedCount / (totalCount > 300 ? totalCount : 300))) {
                this.m_ProgressBar.progress = (completedCount / (totalCount > 300 ? totalCount : 300));

                this.m_lastLoadingProgress = this.m_ProgressBar.progress;

                if (this.m_ProgressBar.progress > 0.8 && !this.audio_played) {
                    this.audio_played = true;
                    cc.audioEngine.playMusic(this.m_loadingSnd, false);
                }
            }
        }, (error: Error) => {
            this.m_currentLoadingTime = this.m_maxLoadingTime;
            this.m_ProgressBar.progress = 1;
            if (GlobalData.G_IsTest == true) {
                cc.director.loadScene('GameScene');
            } else {
                HttpClient.getInstance().ServerConnect({ "SlotEvent": "getSettings" });
            }
        });

        cc.view.setOrientation(cc.macro.ORIENTATION_PORTRAIT);
    }

    onContinue() {
        if (GlobalData.G_IsTest == true) {
            cc.director.loadScene('GameScene');
        } else {
            HttpClient.getInstance().ServerConnect({ "SlotEvent": "getSettings" });
        }
    }

    update(dt: number) {
        // this.m_currentLoadingTime = this.m_currentLoadingTime + dt;
        // if(this.m_currentLoadingTime > this.m_maxLoadingTime){
        //     this.m_currentLoadingTime = this.m_maxLoadingTime;
        // }
        // this.m_ProgressBar.progress = this.m_currentLoadingTime / this.m_maxLoadingTime;
    }
}
