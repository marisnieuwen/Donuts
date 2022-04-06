import * as PIXI from "pixi.js"
import Matter from 'matter-js'
import coinImage from "../images/coin.png"
import coinSoundFile from "url:../sound/coin.mp3"
import { Game } from "./Game"

export class Coin {

    id:number
    sprite: PIXI.Sprite
    rigidBody: Matter.Body
    coinSound:HTMLAudioElement
    game:Game
    
    constructor(game: Game) {
        this.game = game

        this.sprite = PIXI.Sprite.from(coinImage)
        this.sprite.anchor.set(0.5)

        this.rigidBody = Matter.Bodies.circle(Math.random() * 900, -30, 30, { friction: 0.00001, restitution: 0.5, density: 0.001, label: "Coin" }) //x,y,radius
        
        this.id = this.rigidBody.id
        this.game.addToWorld(this.sprite, this.rigidBody)

        this.coinSound = new Audio(coinSoundFile)
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
        this.coinSound.play()
    }
}
