import * as PIXI from "pixi.js"
import { Game } from "./Game"
import Matter from 'matter-js'

export class Ground extends PIXI.Sprite {

    public rigidBody: Matter.Body
    
    constructor(texture: PIXI.Texture, game: Game) {
        super(texture)
        this.anchor.set(0.5)

        this.rigidBody = Matter.Bodies.rectangle(450, 480, 900, 100, { isStatic: true, label:"Ground" }) //x,y,w,h
        Matter.Composite.add(game.engine.world, this.rigidBody)

        // update just once to set the sprite initial position
        this.update()
    }

    public update() {
        this.x = this.rigidBody.position.x
        this.y = this.rigidBody.position.y
    }
}
