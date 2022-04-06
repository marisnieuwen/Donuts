import * as PIXI from "pixi.js"
import groundImage from "../images/ground.png"
import { Game } from "./Game"
import Matter from 'matter-js'

export class Ground {
    sprite: PIXI.Sprite
    rigidBody: Matter.Body
    
    constructor(game: Game) {
        this.sprite = PIXI.Sprite.from(groundImage)
        this.sprite.anchor.set(0.5)

        this.rigidBody = Matter.Bodies.rectangle(450, 480, 900, 100, { isStatic: true, label:"Ground" }) //x,y,w,h
        game.addToWorld(this.sprite, this.rigidBody)

        // update just once to set the sprite
        this.update()
    }

    update() {
        this.sprite.x = this.rigidBody.position.x
        this.sprite.y = this.rigidBody.position.y
    }
}
