// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export class Sound {
    public soundFiles:cc.AudioClip[] = []
    public soundId:number[] = []
    public loadSound(sounds:cc.AudioClip[]){
        for(let i = 0; i < sounds.length; i++){
            this.soundFiles[i] = sounds[i];
        }
        
    }
    private static _instance: Sound = null;
    public static getInstance (): Sound {
        if (Sound._instance == null) {
            Sound._instance = new Sound();
        }

        return Sound._instance;
    }
    public playEffect(id:number, loop:boolean, stop:boolean)
    {
        if(stop == null || stop == true){
            if(this.soundId[id] != null){
                cc.audioEngine.stopEffect(this.soundId[id])
            }
        }
        if(loop == null){
            loop = false
        }
        this.soundId[id] = cc.audioEngine.playEffect(this.soundFiles[id], loop);
    }
    public stopEffect(id:number){
        if(this.soundId[id] != null){
            cc.audioEngine.stopEffect(this.soundId[id]);
        }
    }
    public playBGMusic(id:number, loop:boolean){
        cc.audioEngine.playMusic(this.soundFiles[id], loop);
    }
    public stopBGMusic(){
        cc.audioEngine.stopMusic();
    }    
}
