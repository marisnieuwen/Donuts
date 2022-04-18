import * as PIXI from "pixi.js"
import { Game } from "./Game"
import Matter from 'matter-js'

export class Player extends PIXI.Sprite {

    rigidBody: Matter.Body
    speed: number = 0
    jumpSound:HTMLAudioElement
    game: Game

    constructor(texture: PIXI.Texture, game: Game) {
        super(texture)
        this.game = game
        this.anchor.set(0.5)

        const playerOptions: Matter.IBodyDefinition = {
            density: 0.001,
            friction: 0.7,
            frictionStatic: 0,
            frictionAir: 0.01,
            restitution: 0.5,
            inertia: Infinity,
            inverseInertia: Infinity,
            label: "Player"
        }

        this.rigidBody = Matter.Bodies.rectangle(600, 230, 75, 100, playerOptions)
        Matter.Composite.add(game.engine.world, this.rigidBody)

        window.addEventListener("keydown", (e: KeyboardEvent) => this.onKeyDown(e))
        window.addEventListener("keyup", (e: KeyboardEvent) => this.onKeyUp(e))

        this.jumpSound = game.pixi.loader.resources["jumpsound"].data!
    }

    update() {
        if (this.speed != 0) {
            // velocity
            Matter.Body.setVelocity(this.rigidBody, { x: this.speed, y: this.rigidBody.velocity.y })
            // of translate
            // Matter.Body.translate(this.physicsBox, { x: -10, y: 20 })
        }

        this.x = this.rigidBody.position.x
        this.y = this.rigidBody.position.y
        this.rotation = this.rigidBody.angle // todo make sure rigidbody angle cannot change

        if (this.rigidBody.position.y > 500) this.resetPosition()
    }

    

    onKeyDown(e: KeyboardEvent) {
        if (e.key === " " || e.key === "ArrowUp") {
            if (this.rigidBody.velocity.y > -0.4 && this.rigidBody.velocity.y < 0.4) {
                Matter.Body.applyForce(this.rigidBody, { x: this.rigidBody.position.x, y: this.rigidBody.position.y }, { x: 0, y: -0.25 })
                this.jumpSound.play()
            }
        }
        switch (e.key) {
            case "ArrowLeft":
                this.speed = -5
                break
            case "ArrowRight":
                this.speed = 5
                break
        }
    }

    onKeyUp(e: KeyboardEvent) {
        switch (e.key) {
            case "ArrowLeft":
            case "ArrowRight":
                this.speed = 0
                break
        }
    }

    // in case mario goes out of bounds
    resetPosition() {
        Matter.Body.setPosition(this.rigidBody, { x: 120, y: 30 })
        Matter.Body.setVelocity(this.rigidBody, { x: 0, y: 0 })
        Matter.Body.setAngularVelocity(this.rigidBody, 0)
    }

    beforeUnload() {

    }
}
