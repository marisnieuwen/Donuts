# Pixi Matters

Game demo using PixiJS, MatterJS with Typescript in OOP. The project is compiled using Parcel. 

[Try the demo here](https://kokodoko.github.io/piximatters/)

![screen](./src/images/screen.png)

<br>
<br>
<br>

# Installing this example

First install [NodeJS](https://nodejs.org/en/). Then install all required libraries in one go. (PixiJS, MatterJS, Typescript and Parcel)

```
npm install
```

Start development in a live server
```
npm run start
```
Build the project for publication
```
npm run build
```


<br>
<br>
<br>

# Physics basics

In `Game.ts` we create a physics world. The physics world gets updated 60 times per second using Pixi's update loop. You can update your own sprites after the physics world has updated.

GAME.TS
```typescript
import Matter from 'matter-js'

class Game {
    onLoaded(){
        this.engine = Matter.Engine.create()
    }
    update() {
        Matter.Engine.update(this.engine, 1000 / 60)
        // update your sprites 
        // ...
    }
}

```
Sprites classes can create a `rigidBody` at the same size as their sprite image. The rigidbody has to be added to the physics simulation. You can add a label, this will be useful later for collision detection.

Then, every frame, the sprite reads the position of its own rigidBody, to know where to draw itself on the canvas. In other words: *MatterJS* creates the physics simulation, and *PixiJS* draws the sprites on the canvas.

FISH.TS
```typescript
class Fish extends PIXI.Sprite {
    constructor(texture:PIXI.Texture, game:Game) {
        super(texture)
        this.rigidBody = Matter.Bodies.rectangle(300, 30, 60, 60, {label:"Fish"}) //x,y,w,h
        Matter.Composite.add(game.engine.world, this.rigidBody)
    }
    update() {
        this.x = this.rigidBody.position.x
        this.y = this.rigidBody.position.y
        this.rotation = this.rigidBody.angle
    }
}
```

<br>

Now you can add a `new Fish()` to your game!

GAME.TS
```typescript
class Game {
    myfish:Fish
    doneLoading(){
        this.myfish = new Fish(this.pixi.loader.resources["fish"].texture!, this)
        this.pixi.stage.addChild(myfish)
    }
    update(delta:number){
         Matter.Engine.update(this.engine, 1000 / 60)
         myfish.update()
    }
}
```

<br>
<br>
<br>

# Moving 

Rigidbodies automatically move and bounce because `forces` are applied to them (*gravity, friction, bouncyness, and other forces*). This results in a `velocity` (*current movement*) of the sprite. You can always check the velocity using `console.log(this.rigidBody.velocity)`

To move a physics sprite yourself, you can add a force that affects the rigidbody. You can also directly set the velocity of the rigidbody. 

```typescript
// apply a upward force (jump)
Matter.Body.applyForce(this.rigidBody, { x: this.rigidBody.position.x, y: this.rigidBody.position.y }, { x: 0, y: -0.25 })

// set velocity directly
Matter.Body.setVelocity(this.rigidBody, { x: 10, y: 10 })
```

***Static elements*** have no forces applied to them, but can still collide with other physics elements. This is ideal for the ground and platforms.

```typescript
this.rigidBody = Matter.Bodies.rectangle(450, 480, 900, 100, { isStatic: true, label:"Ground" })
```

If your object only has to move through player interaction (*a player character*), then you can set `inertia` to false.

```typescript
 const playerOptions: Matter.IBodyDefinition = {
    inertia: Infinity,
    inverseInertia: Infinity,
    label: "Player"
}
this.rigidBody = Matter.Bodies.rectangle(600, 230, 75, 100, playerOptions)
```

<br>
<br>
<br>

# Collision

The best part of a physics engine is that you get detailed collision detection:

```typescript
class Game {
    onLoaded() {
        this.engine = Matter.Engine.create()
        Matter.Events.on(this.engine, 'collisionStart', (event) => this.onCollision(event))
    }
    onCollision(event: Matter.IEventCollision<Matter.Engine>) {
        let collision = event.pairs[0]
        let [bodyA, bodyB] = [collision.bodyA, collision.bodyB]
        console.log(`${bodyA.label} collides with ${bodyB.label}`)
    } 
}
```

### Finding the sprite that collided

Collision detection returns only the `rigidBody` that collided, we have to find the sprite that uses this rigidbody:

```typescript
findSpriteWithRigidbody(rb: Matter.Body) {
    return this.allSprites.find((sprite) => sprite.rigidBody === rb)
}
```

If you want certain items (*for example coins in a mario game*) not to collide with each other (but still collide with other items in the game), then you can add a [Collision Filter](https://brm.io/matter-js/demo/#collisionFiltering)

<br>
<br>
<br>

# Hitbox

By making the rigidbody a different size than the sprite, you can create a custom hitbox. When positioning the sprite, make sure to correct for the smaller hitbox.

```typescript
// FISH TEXTURE WIDTH x HEIGHT     = 60 X 60
// SMALLER HITBOX WIDTH x HEIGHT   = 30 X 30
this.rigidBody = Matter.Bodies.rectangle(15, 15, 30, 30, {label:"Fish"}) 
// draw the sprite with 15 pixels offset
this.x = this.rigidBody.position.x - 15
this.y = this.rigidBody.position.y - 15
```

### Drawing the hitbox

Just to be sure what's happening you can [draw your hitbox using Pixi's drawing code](https://pixijs.io/examples/#/graphics/simple.js). This example draws a rectangle hitbox:

```typescript
constructor(texture: PIXI.Texture, game:Game) {
    let rigidBodyWidth = 60
    let rigidBodyHeight = 60

    this.rigidBody = Matter.Bodies.rectangle(Math.random() * 900, -30, rigidBodyWidth, rigidBodyHeight, {label:"Crate"}) //x,y,w,h
    Matter.Composite.add(game.engine.world, this.rigidBody)

    // draw a hitbox
    let hitbox = new PIXI.Graphics()
    hitbox.lineStyle(2, 0x33FF33, 1)
    hitbox.drawRect(-30, -30, rigidBodyWidth, rigidBodyHeight) // x offset, y offset, width, height
    this.addChild(hitbox)
}
```

A hitbox can also be a circle. [Or you can create a *compound hitbox* out of several rigidbodies](https://brm.io/matter-js/docs/classes/Composite.html). [Finally there is the option of creating a hand-drawn hitbox with a physics editor.](https://www.codeandweb.com/physicseditor)

<br>
<br>
<br>

# Links

- [PixiJS](https://pixijs.io/guides/basics/getting-started.html)
- [Drawing](https://pixijs.io/examples/#/graphics/simple.js)
- [MatterJS](https://brm.io/matter-js/) en [API](https://brm.io/matter-js/docs/)
- [MatterJS Live Demos](https://brm.io/matter-js/demo/)
- [Collision Filters](https://brm.io/matter-js/demo/#collisionFiltering) and [documentation](https://brm.io/matter-js/docs/classes/Body.html#property_collisionFilter)

<br>
<br>
<br>

## PixiJS demos

- [Space Shooter](https://github.com/KokoDoko/pixidust)
- [Physics](https://github.com/KokoDoko/piximatters)
- [Flappy Bird](https://github.com/KokoDoko/pixibird.git)
