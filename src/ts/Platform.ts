import * as PIXI from "pixi.js"
import Matter from 'matter-js'
import platformImage from "../images/platform.png"
import { Game } from "./Game"

export class Platform {
    sprite: PIXI.Sprite
    rigidBody: Matter.Body
    
    constructor(game: Game) {
        this.sprite = PIXI.Sprite.from(platformImage)
        this.sprite.anchor.set(0.5)

        this.rigidBody = Matter.Bodies.rectangle(100, 250, 220, 50, { angle:0.2,  isStatic: true, label:"Platform" }) //x,y,w,h
        game.addToWorld(this.sprite, this.rigidBody)

        // update just once to set the sprite
        this.update()
    }

    update() {
        this.sprite.rotation = this.rigidBody.angle
        this.sprite.x = this.rigidBody.position.x
        this.sprite.y = this.rigidBody.position.y
    }
}
