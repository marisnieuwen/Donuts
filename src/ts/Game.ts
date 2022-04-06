import "../css/styles.css"
import Matter from 'matter-js'
import * as PIXI from "pixi.js"
import { Crate } from "./Crate"
import { Coin } from "./Coin"
import { Ground } from "./Ground"
import { Platform } from "./Platform"
import { Player } from "./Player"

export class Game {

    pixi: PIXI.Application
    engine: Matter.Engine
    elements: (Crate | Coin | Player)[] = []

    constructor() {
        const container = document.getElementById("container")!
        this.pixi = new PIXI.Application({ width: 900, height: 500, backgroundColor:0x223388 })
        container.appendChild(this.pixi.view)

        this.engine = Matter.Engine.create()
        Matter.Events.on(this.engine, 'collisionStart', (event) => this.onCollision(event))

        // static platforms
        let ground = new Ground(this)
        let platform = new Platform(this)

        this.elements.push(new Player(this))
        
        // keep adding boxes and coins
        setInterval(() => {
            if(this.elements.length%2 == 0 ) {
                this.elements.push(new Crate(this))
            } else {
                this.elements.push(new Coin(this))
            }
        }, 2000)

        // start update loop
        this.pixi.ticker.add(() => this.update())
    }

    // add a sprite to the pixi canvas and its rigidbody to the physics simulation
    addToWorld(sprite: PIXI.Sprite, physicsBox: Matter.Body) {
        Matter.Composite.add(this.engine.world, physicsBox)
        this.pixi.stage.addChild(sprite)
    }

    update() {
        Matter.Engine.update(this.engine, 1000 / 60)

        for (let el of this.elements) {
            el.update()
        }
    }

    // check who hits what - todo: use collisionFilter if you dont want coins to hit each other
    onCollision(event: Matter.IEventCollision<Matter.Engine>) {
        let collision = event.pairs[0]
        let [bodyA, bodyB] = [collision.bodyA, collision.bodyB]
        let element = undefined
        // console.log(`${bodyA.label} ${bodyA.id} hits ${bodyB.label} ${bodyA.id}`)
        if (bodyA.label === "Coin" && bodyB.label === "Player") {
            element = this.findElementById(bodyA.id)
        }
        if (bodyA.label === "Player" && bodyB.label === "Coin") {
            element = this.findElementById(bodyB.id)
        }
        if (element) this.removeElement(element)
    } 

    findElementById(id:number) {
        return this.elements.find( (element) => element.id === id)
    }

    removeElement(element: Crate | Coin | Player) {
        element.beforeUnload()
        Matter.Composite.remove(this.engine.world, element.rigidBody)
        this.pixi.stage.removeChild(element.sprite)
        this.elements = this.elements.filter((el: Crate | Coin | Player) => el != element)
        // console.log(`Removed id ${element.id}. Elements left: ${this.elements.length}`)
    }
    
}

new Game()