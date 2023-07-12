const { ccclass, property } = cc._decorator;

@ccclass
export default class NodeDialog extends cc.Component {

    @property(cc.Label)
    message: cc.Label = null;

    start() {

    }

    show(message: string) {
        this.message.string = message;
        this.node.active = true;
    }

    hide() {
        this.node.active = false;
        this.message.string = "";
    }
}
