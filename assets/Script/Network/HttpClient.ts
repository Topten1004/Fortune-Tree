const { ccclass, property } = cc._decorator;
import Language from "../Language/Language";
import { NetTrans } from "../FortuneTree/NetTrans";

@ccclass
export default class HttpClient {

    private static _instance: HttpClient = null;
    public static getInstance(): HttpClient {
        if (HttpClient._instance == null) {
            HttpClient._instance = new HttpClient();
            HttpClient._instance.dialg = cc.find("node_Dialog");
        }

        return HttpClient._instance;
    }
    public dialg;
    public responseTimeout;
    public responseTimeoutTime: 10000;// 10 seconds for timeout
    public ServerConnect(pObj) {
        let self = this
        // this.responseTimeout=setTimeout(function(){
        //     self.ServerConnect(pObj)
        // },this.responseTimeoutTime);	
        // console.log("--ServerConnect--")
        var mainSlotRes = new XMLHttpRequest();
        mainSlotRes.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status >= 200 && this.status < 400) {
                    var setObj = JSON.parse(this.responseText);
                    // if(setObj.responseEvent!=undefined){
                    //     clearTimeout(self.responseTimeout);     
                    // }
                    if (setObj.responseEvent == "error") {
                        if (self.dialg != null) {
                            self.dialg.show(Language.getInstance().getString(setObj.serverResponse));
                        }
                    } else {
                        self.ResponseController(setObj);
                    }
                } else if (this.status == 404) {
                    if (self.dialg != null) {
                        self.dialg.show(Language.getInstance().getString("NetworkError"));
                    }
                }
            }
        };
        mainSlotRes.addEventListener('error', function (e) {
            if (self.dialg != null) {
                self.dialg.show(Language.getInstance().getString("NetworkError"));
            }
        });
        var postData = JSON.stringify(pObj);
        mainSlotRes.timeout = 55000;// 5 seconds for timeout

        mainSlotRes.open("POST", "/game/FortuneTreeJW/server?sessionId=" + sessionStorage.getItem('sessionId'), true);
        mainSlotRes.setRequestHeader('Content-type', 'application/json; charset=utf-8');

        // mainSlotRes.open("POST", "http://localhost:13014/game/FortuneTreeJW/server?sessionId=" + sessionStorage.getItem('sessionId'), true);

        mainSlotRes.send(postData);
    }
    public ResponseController(pObj) {
        // console.log('[HttpClient]--ResponseController', pObj);
        NetTrans.onCommand(pObj);
    }
    public setDialog(dialog) {
        this.dialg = dialog;
    }
}
