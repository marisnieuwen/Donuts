import "../css/styles.css"
import Matter from 'matter-js'
import * as PIXI from "pixi.js"

import crateImage from "../images/crate.png"
import coinImage from "../images/coin.png"
import platformImage from "../images/platform.png"
import groundImage from "../images/ground.png"
import playerImage from "../images/mario.png"
import jumpSoundFile from "url:../sound/jump.mp3"  
import coinSoundFile from "url:../sound/coin.mp3" 

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
        console.log("yoo")

        const container = document.getElementById("container")!
        this.pixi = new PIXI.Application({ width: 900, height: 500, backgroundColor:0x223388 })
        container.appendChild(this.pixi.view)

        this.engine = Matter.Engine.create()
        Matter.Events.on(this.engine, 'collisionStart', (event) => this.onCollision(event))

        this.pixi.loader
            .add("crate", crateImage)
            .add("coin", coinImage)
            .add("platform", platformImage)
            .add("ground", groundImage)
            .add("player", playerImage)
            .add("jumpsound", jumpSoundFile)
            .add("coinsound", coinSoundFile)

        //this.pixi.loader.onProgress.add((p: PIXI.Loader) => this.showProgress(p))
        //this.pixi.loader.onComplete.add(() => this.doneLoading())
        this.pixi.loader.load(() => this.doneLoading())
    }

    doneLoading() {
        // static platforms
        let ground = new Ground(this.pixi.loader.resources["ground"].texture!, this)
        this.pixi.stage.addChild(ground)

        let platform = new Platform(this.pixi.loader.resources["platform"].texture!, this)
        this.pixi.stage.addChild(platform)

        let player = new Player(this.pixi.loader.resources["player"].texture!, this)
        this.elements.push(player)
        this.pixi.stage.addChild(player)

        // keep adding boxes and coins
        setInterval(() => {
            
            if (this.elements.length % 2 == 0) {
                let crate = new Crate(this.pixi.loader.resources["crate"].texture!, this)
                this.elements.push(crate)
                this.pixi.stage.addChild(crate)
            } else {
                let coin = new Coin(this.pixi.loader.resources["coin"].texture!, this)
                this.elements.push(coin)
                this.pixi.stage.addChild(coin)
            }
        }, 2000)
       
        // start update loop
        this.pixi.ticker.add(() => this.update())
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
        // console.log(`${bodyA.label} ${bodyA.id} hits ${bodyB.label} ${bodyA.id}`)
        if (bodyA.label === "Coin" && bodyB.label === "Player") {
            let element = this.findSpriteWithRigidbody(bodyA)
            if (element) this.removeElement(element)
        }
        if (bodyA.label === "Player" && bodyB.label === "Coin") {
            let element = this.findSpriteWithRigidbody(bodyB)
            if (element) this.removeElement(element)
        }
    } 

    findSpriteWithRigidbody(rb: Matter.Body) {
        return this.elements.find((element) => element.rigidBody === rb)
    }

    removeElement(element: Crate | Coin | Player) {
        element.beforeUnload()
        Matter.Composite.remove(this.engine.world, element.rigidBody)                           // stop physics simulation
        this.pixi.stage.removeChild(element)                                                    // stop drawing on the canvas
        this.elements = this.elements.filter((el: Crate | Coin | Player) => el != element)      // stop updating
        // console.log(`Removed id ${element.id}. Elements left: ${this.elements.length}`)
    }
    
}

new Game()