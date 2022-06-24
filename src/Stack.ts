import * as PIXI from "pixi.js"
import { Game } from "./Game"
import Matter from 'matter-js'
import { ObservablePoint } from "pixi.js"

export class Stack extends PIXI.Sprite {

    rigidBody: Matter.Body
    game:Game
    
    constructor(texture: PIXI.Texture, game:Game) {
        super(texture)
        this.game = game

        this.anchor.set(0.5)   

        this.rigidBody = Matter.Bodies.rectangle(Math.random() * 900, -30, 60, 60, {label:"Stack"}) //x,y,w,h
        Matter.Composite.add(game.engine.world, this.rigidBody)
    }

    update() {       
        this.position.set(this.rigidBody.position.x, this.rigidBody.position.y)
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
