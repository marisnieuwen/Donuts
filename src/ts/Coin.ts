import * as PIXI from "pixi.js"
import Matter from 'matter-js'
import { Game } from "./Game"

export class Coin extends PIXI.Sprite {

    rigidBody: Matter.Body
    coinSound:HTMLAudioElement
    game:Game
    
    constructor(texture: PIXI.Texture, game: Game) {
        super(texture)
        this.game = game

        this.anchor.set(0.5)

        this.rigidBody = Matter.Bodies.circle(Math.random() * 900, -30, 30, { friction: 0.00001, restitution: 0.5, density: 0.001, label: "Coin" }) //x,y,radius
        Matter.Composite.add(game.engine.world, this.rigidBody)
        
        this.coinSound = game.pixi.loader.resources["coinsound"].data!
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
        this.coinSound.play()
    }
}
