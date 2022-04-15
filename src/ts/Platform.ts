import * as PIXI from "pixi.js"
import Matter from 'matter-js'
import { Game } from "./Game"

export class Platform extends PIXI.Sprite {

    rigidBody: Matter.Body
    
    constructor(texture: PIXI.Texture, game: Game) {
        super(texture)
        this.anchor.set(0.5)

        this.rigidBody = Matter.Bodies.rectangle(100, 250, 220, 50, { angle:0.2,  isStatic: true, label:"Platform" }) //x,y,w,h
        Matter.Composite.add(game.engine.world, this.rigidBody)

        // update just once to set the sprite
        this.update()
    }

    update() {
        this.rotation = this.rigidBody.angle
        this.x = this.rigidBody.position.x
        this.y = this.rigidBody.position.y
    }
}
