import * as PIXI from "pixi.js"
import { Rectangle } from "pixi.js"
import { Game } from "./game"

export class UI extends PIXI.Container {
    public game: Game;
    public scoreField:PIXI.Text
    public score:number = 0;

    constructor(game:Game, texture: PIXI.Texture){
        super()
        this.game = game
        this.score = this.score
        const style = new PIXI.TextStyle({
            fontFamily: 'Electrolize',
            fontSize: 40,
            fontWeight: 'bold',
            fill: ['#010101']
        })
    
        this.scoreField = new PIXI.Text(`Score : 0`, style)
        this.addChild(this.scoreField)
        this.scoreField.x = 10
        this.scoreField.y = 10
        
    }

    addScore(n:number) {
        this.score += n;
        this.scoreField.text = `Score : ${this.score}`
    }
}