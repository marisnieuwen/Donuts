import * as PIXI from "pixi.js"
import crateImage from "../images/crate.png"
import { Game } from "./Game"
import Matter from 'matter-js'

export class Crate {

    id: number
    sprite: PIXI.Sprite
    rigidBody: Matter.Body
    game:Game
    
    constructor(game: Game) {
        this.game = game

        this.sprite = PIXI.Sprite.from(crateImage)
        this.sprite.anchor.set(0.5)

        this.rigidBody = Matter.Bodies.rectangle(Math.random() * 900, -30, 60, 60, {label:"Crate"}) //x,y,w,h
        this.id = this.rigidBody.id
        // add sprite and physics elements to the world
        this.game.addToWorld(this.sprite, this.rigidBody)
    }

    update() {
        this.sprite.x = this.rigidBody.position.x
        this.sprite.y = this.rigidBody.position.y
        this.sprite.rotation = this.rigidBody.angle

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
