import { Common } from "../Common/Common";
import { Sound } from "../Common/Sound";
const { ccclass, property } = cc._decorator;

@ccclass
export default class Help extends cc.Component {
    @property(cc.SpriteFrame)
    m_HelpInfoImages: cc.SpriteFrame[] = [];
    @property(cc.Sprite)
    m_HelpInfoPanel: cc.Sprite = null;

    @property(cc.Button)
    m_BtnArrowLeft: cc.Button = null;
    @property(cc.Button)
    m_BtnArrowRight: cc.Button = null;
    @property(cc.Button)
    m_BtnBack: cc.Button = null;
    m_CurrentPage: number = 0;

    onArrowLeft() {
        this.m_CurrentPage--;
        if (this.m_CurrentPage < 0) {
            this.m_CurrentPage += 4;
        }

        this.m_HelpInfoPanel.spriteFrame = this.m_HelpInfoImages[this.m_CurrentPage % 4];
        Sound.getInstance().playEffect(Common.s_sound.BtnSound, false, true)
    }
    onArrowRight() {
        this.m_CurrentPage++;
        this.m_HelpInfoPanel.spriteFrame = this.m_HelpInfoImages[this.m_CurrentPage % 4];
        Sound.getInstance().playEffect(Common.s_sound.BtnSound, false, true)
    }
    onBack() {
        this.node.active = false;
        Sound.getInstance().playEffect(Common.s_sound.BtnSound, false, true)
    }
}
