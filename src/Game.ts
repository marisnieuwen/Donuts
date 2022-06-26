import Matter from 'matter-js'
import * as PIXI from "pixi.js"

import { Stack } from "./Stack"
import { Donut } from "./Donut"
import { Ground } from "./Ground"
import { Platform } from "./Platform"
import { Player } from "./Player"
import { UI } from "./UI"

// import { StartButton } from './startButton'
import { GameOverButton } from './GameOver'


import stackImage from "./images/apple.png"
import donutImage from "./images/donut.png"
import platformImage from "./images/platformMini.png"
import groundImage from "./images/ground3.png"
import playerImage from "./images/player2.png"
import startButton from "./images/start.png"


export class Game {
    public pixi: PIXI.Application
    public engine: Matter.Engine
    private interface : UI
    private elements: (Stack | Donut | Player)[] = []

    private player: Player
    private donut: Donut
    private stack: Stack

    doomClock:number = 3600;
    doomText: any

    private gameOverButton: GameOverButton

    // public startButton: StartButton


    constructor() {
        const container = document.getElementById("container")!
        this.pixi = new PIXI.Application({ width: 1000, height: 700, backgroundColor:0x93d4fe })
        container.appendChild(this.pixi.view)

        this.engine = Matter.Engine.create()
        Matter.Events.on(this.engine, 'collisionStart', (event) => this.onCollision(event))

        this.pixi.loader
            .add("stack", stackImage)
            .add("donut", donutImage)
            .add("platform", platformImage)
            .add("ground", groundImage)
            .add("player", playerImage)
            .add('startButtonTexture', startButton)

        this.pixi.loader.load(() => this.doneLoading())
    }

    private doneLoading() {

        let ground = new Ground(this.pixi.loader.resources["ground"].texture!, this)
        this.pixi.stage.addChild(ground)

        let platform = new Platform(this.pixi.loader.resources["platform"].texture!, this)
        this.pixi.stage.addChild(platform)

        let player = new Player(this.pixi.loader.resources["player"].texture!, this)
        this.elements.push(player)
        this.pixi.stage.addChild(player)

        this.doomText = new PIXI.Text(`Time left: `)
        this.pixi.stage.addChild(this.doomText)
        this.doomText.x = 550
        this.doomText.y = 10


        this.interface = new UI();
        this.pixi.stage.addChild(this.interface);

        // work in progress
        // this.startButton = new StartButton(this.pixi.loader.resources["startButtonTexture"].texture!, this)
        // this.pixi.stage.addChild(this.startButton) 

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

        
       

        this.pixi.ticker.add((delta) => this.update(delta))
    }


    public update(delta:number) {
        Matter.Engine.update(this.engine, 1000 / 60)

        for (let el of this.elements) {
            el.update()
        }

        this.doomClock-=delta
        let secondsLeft = Math.floor(this.doomClock / 60)
        if(this.doomClock <= 0) {
            console.log("Time is up!")
            this.doomText.text = `Time is up`
            this.gameOver()

        } else {
            console.log(`Only ${secondsLeft} seconds left!`)
            this.doomText.text = `You have ${secondsLeft} second left!`
        }
    }

    // work in progress, doesn't work right now
    public gameOver() {
        console.log("game over")
        this.pixi.stop()
        this.gameOverButton = new GameOverButton(this.pixi.loader.resources["startButtonTexture"].texture!, this)
        this.pixi.stage.addChild(this.gameOverButton)
    }

    //work in progress, doesn't work right now
    public resetGame() {
        this.gameOverButton.destroy()
        this.player.resetPosition()
        this.donut.resetPosition()
        this.stack.resetPosition()
        this.pixi.start()
    }

    public onCollision(event: Matter.IEventCollision<Matter.Engine>) {
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

    public findSpriteWithRigidbody(rb: Matter.Body) {
        return this.elements.find((element) => element.rigidBody === rb)
    }

    public removeElement(element: Stack | Donut | Player) {
        element.beforeUnload()
        Matter.Composite.remove(this.engine.world, element.rigidBody)                      
        this.pixi.stage.removeChild(element)                                                  
        this.elements = this.elements.filter((el: Stack | Donut | Player) => el != element)      
    }
    
}

new Game()