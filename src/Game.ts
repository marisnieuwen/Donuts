import Matter from 'matter-js'
import * as PIXI from "pixi.js"

import { Stack } from "./Stack"
import { Donut } from "./Donut"
import { Ground } from "./Ground"
import { Platform } from "./Platform"
import { Player } from "./Player"
import { UI } from "./UI";

import stackImage from "./images/donutstack.png"
import donutImage from "./images/donut.png"
import platformImage from "./images/platformMini.png"
import groundImage from "./images/ground2.png"
import playerImage from "./images/player2.png"

export class Game {

    private pixi: PIXI.Application
    public engine: Matter.Engine
    private interface : UI;
    private elements: (Stack | Donut | Player)[] = []

    constructor() {

        const container = document.getElementById("container")!
        this.pixi = new PIXI.Application({ width: 900, height: 500, backgroundColor:0x93d4fe })
        container.appendChild(this.pixi.view)

        this.engine = Matter.Engine.create()
        Matter.Events.on(this.engine, 'collisionStart', (event) => this.onCollision(event))

        this.pixi.loader
            .add("stack", stackImage)
            .add("donut", donutImage)
            .add("platform", platformImage)
            .add("ground", groundImage)
            .add("player", playerImage)

        this.pixi.loader.load(() => this.doneLoading())
    }

    doneLoading() {

        let ground = new Ground(this.pixi.loader.resources["ground"].texture!, this)
        this.pixi.stage.addChild(ground)

        let platform = new Platform(this.pixi.loader.resources["platform"].texture!, this)
        this.pixi.stage.addChild(platform)

        let player = new Player(this.pixi.loader.resources["player"].texture!, this)
        this.elements.push(player)
        this.pixi.stage.addChild(player)

        this.interface = new UI();
        this.pixi.stage.addChild(this.interface);

        setInterval(() => {
            
            if (this.elements.length % 2 == 0) {
                let stack = new Stack(this.pixi.loader.resources["stack"].texture!, this)
                this.elements.push(stack)
                this.pixi.stage.addChild(stack)
            } else {
                let donut = new Donut(this.pixi.loader.resources["donut"].texture!, this)
                this.elements.push(donut)
                this.pixi.stage.addChild(donut)
            }
        }, 2000)
       

        this.pixi.ticker.add(() => this.update())
    }

    update() {
        Matter.Engine.update(this.engine, 1000 / 60)

        for (let el of this.elements) {
            el.update()
        }
    }


    onCollision(event: Matter.IEventCollision<Matter.Engine>) {
        let collision = event.pairs[0]
        let [bodyA, bodyB] = [collision.bodyA, collision.bodyB]
        if (bodyA.label === "Donut" && bodyB.label === "Player") {
            let element = this.findSpriteWithRigidbody(bodyA)
            if (element) this.removeElement(element)
            this.interface.addScore(1);
        }
        if (bodyA.label === "Player" && bodyB.label === "Donut") {
            let element = this.findSpriteWithRigidbody(bodyB)
            if (element) this.removeElement(element)
            this.interface.addScore(1);
        }
    } 

    findSpriteWithRigidbody(rb: Matter.Body) {
        return this.elements.find((element) => element.rigidBody === rb)
    }

    removeElement(element: Stack | Donut | Player) {
        element.beforeUnload()
        Matter.Composite.remove(this.engine.world, element.rigidBody)                      
        this.pixi.stage.removeChild(element)                                                  
        this.elements = this.elements.filter((el: Stack | Donut | Player) => el != element)      
    }
    
}

new Game()