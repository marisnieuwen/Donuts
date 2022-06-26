import * as PIXI from "pixi.js"
import { Game } from "./Game"


export class StartButton extends PIXI.Sprite {
    game: Game

    constructor(texture: PIXI.Texture, game: Game) {
        super(texture)
        this.game = game


        this.x = 200
        this.y = 300


        this.interactive = true
        this.buttonMode = true
        this.on('pointerdown', () => this.buttonClicked())
    }


    buttonClicked() {
        console.log("clicked start button!")
        this.game.actualGame()
    }
}