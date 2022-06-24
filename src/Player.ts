import * as PIXI from "pixi.js"
import { Game } from "./Game"
import Matter from 'matter-js'

export class Player extends PIXI.Sprite {

    public rigidBody: Matter.Body
    private speed: number = 0
    public game: Game

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

    }

    public update() {
        if (this.speed != 0) {
            Matter.Body.setVelocity(this.rigidBody, { x: this.speed, y: this.rigidBody.velocity.y })
        }

        this.x = this.rigidBody.position.x
        this.y = this.rigidBody.position.y
        this.rotation = this.rigidBody.angle

        if (this.rigidBody.position.y > 500) this.resetPosition()
    }

    

    private onKeyDown(e: KeyboardEvent) {
        if (e.key.toUpperCase() === "W" || e.key === "ArrowUp") {
            if (this.rigidBody.velocity.y > -0.4 && this.rigidBody.velocity.y < 0.4) {
                Matter.Body.applyForce(this.rigidBody, { x: this.rigidBody.position.x, y: this.rigidBody.position.y }, { x: 0, y: -0.25 })
            }
        }
        switch (e.key.toUpperCase()) {
            case "A":
            case "ARROWLEFT":
                this.speed = -4
                this.scale.set(1, 1)
                break
            case "D":
            case "ARROWRIGHT":
                this.speed = 4
                this.scale.set(-1, 1)
                break
        }
    }

   private onKeyUp(e: KeyboardEvent) {
        switch (e.key.toUpperCase()) {
            case "A":
            case "D":
            case "ArrowLeft":
            case "ArrowRight":
                this.speed = 0
                break
        }
    }

    public resetPosition() {
        Matter.Body.setPosition(this.rigidBody, { x: 120, y: 30 })
        Matter.Body.setVelocity(this.rigidBody, { x: 0, y: 0 })
        Matter.Body.setAngularVelocity(this.rigidBody, 0)
    }

   public beforeUnload() {

    }
}
