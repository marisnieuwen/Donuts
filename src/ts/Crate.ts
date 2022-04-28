import * as PIXI from "pixi.js"
import { Game } from "./Game"
import Matter from 'matter-js'

export class Crate extends PIXI.Sprite {

    rigidBody: Matter.Body
    game:Game
    
    constructor(texture: PIXI.Texture, game:Game) {
        super(texture)
        this.game = game

        this.anchor.set(0.5)   

        this.rigidBody = Matter.Bodies.rectangle(Math.random() * 900, -30, 60, 60, {label:"Crate"}) //x,y,w,h
        Matter.Composite.add(game.engine.world, this.rigidBody)

        // draw a hitbox - handy for debugging
        /*
        let hitbox = new PIXI.Graphics()
        hitbox.lineStyle(2, 0x33FF33, 1)
        hitbox.drawRect(-30, -30, 60, 60)
        this.addChild(hitbox)
        */
    }

    update() {
        this.x = this.rigidBody.position.x
        this.y = this.rigidBody.position.y
        this.rotation = this.rigidBody.angle
       
        if (this.rigidBody.position.y > 500) this.game.removeElement(this)
    }

    resetPosition() {
        Matter.Body.setPosition(this.rigidBody, {x:120, y:30})
        Matter.Body.setVelocity(this.rigidBody, {x:0, y:0})
        Matter.Body.setAngularVelocity(this.rigidBody, 0)
    }

    beforeUnload() {

    }
}
