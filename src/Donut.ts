import * as PIXI from "pixi.js"
import Matter from 'matter-js'
import { Game } from "./Game"

export class Donut extends PIXI.Sprite {

    public rigidBody: Matter.Body
    public game:Game
    
    constructor(texture: PIXI.Texture, game: Game) {
        super(texture)
        this.game = game

        this.anchor.set(0.5)

        this.rigidBody = Matter.Bodies.circle(Math.random() * 900, -30, 30, { friction: 0.00001, restitution: 0.5, density: 0.001, label: "Donut" }) //x,y,radius
        Matter.Composite.add(game.engine.world, this.rigidBody)
        
    }

    public update() {
        this.position.set(this.rigidBody.position.x, this.rigidBody.position.y)
        this.rotation = this.rigidBody.angle

        if (this.rigidBody.position.y > 500) this.game.removeElement(this)
    }

    public resetPosition() {
        Matter.Body.setPosition(this.rigidBody, {x:120, y:30})
        Matter.Body.setVelocity(this.rigidBody, {x:0, y:0})
        Matter.Body.setAngularVelocity(this.rigidBody, 0)
    }

    public beforeUnload() {

    }
}
