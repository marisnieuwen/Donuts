import * as PIXI from "pixi.js"
import { Donut } from "./Donut"
import { Game } from "./Game"
import { Player } from "./Player"
import { Stack } from "./Stack"

export class GameOverButton extends PIXI.Sprite {
    game: Game
    donut: Donut
    player: Player
    stack: Stack

    constructor(texture: PIXI.Texture, game: Game) {
        super(texture)
        this.game = game

        this.width = 338
        this.height = 85
        this.x = 350
        this.y = 100

        this.interactive = true
        this.buttonMode = true
        this.on('pointerdown', () => this.buttonClicked())
    }

    buttonClicked() {
        this.game.resetGame()
    }
}