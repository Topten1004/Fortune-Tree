// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
// const i18n = require('i18n');
// import i18n from '../../resources/i18n';
import { i18n } from "../../resources/i18n/i18n";
@ccclass
export default class Language {
    private static _instance : Language;
    public static getInstance(){
        if(Language._instance == null){
            Language._instance = new Language();
        }
        return Language._instance;
    }
    public initLang(lang : string){
        i18n.init(lang);
    }
    public getString(key : string){
        return i18n.t(key);
    }
}
