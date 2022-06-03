import * as utils from '@dcl/ecs-scene-utils'

import { Scene } from './scene'
import { SoundLibrary } from './soundLibrary'
import { SkeletonEnemy } from './skeletonEnemy'
import { StatusEffectResolver } from './statusEffectResolver'

export class Spawner extends Entity {
  hp: number
  level: number = 1
  maxEnemies: number = 5
  scene: Scene
  soundLibrary: SoundLibrary
  spawnCounter: number = 0
  statusEffectResolver: StatusEffectResolver
  statusEffects = []
  speed = 4

  BASE_SPAWN_TIME = 4000
  MAX_TIME_OFFSET = 2000

  constructor(
    name: string,
    scene: Scene,
    soundLibrary: SoundLibrary,
    statusEffectResolver: StatusEffectResolver,
    transform: Transform
  ) {
    super(name)
    engine.addEntity(this)
    this.setParent(scene)
    this.addComponent(transform)

    const model = new GLTFShape('models/portal.glb')
    model.withCollisions = true
    model.isPointerBlocker = true
    model.visible = true
    this.addComponent(model)

    this.scene = scene
    this.soundLibrary = soundLibrary
    this.statusEffectResolver = statusEffectResolver

    this.hp = 125 * this.level

    return this
  }

  // TODO: implement speed in such a way that slow status effect will make the
  // spawner delay spawns and stop entirely if frozen. maybe the best way to add
  // slowdown(2) / speedup(2) functions to enemy classes and de/increment speed
  // that way - the status resolver still works and i can create what are basically
  // "onspeedchange" events

  initialize() {
    let spawnTime = this.BASE_SPAWN_TIME + Math.random() * this.MAX_TIME_OFFSET

    this.addComponent(
      new utils.Interval(spawnTime, () => {
        // TODO: this logic should instead respond to the total enemies currently in combat
        if ( this.spawnCounter === this.maxEnemies ) { return null }
        log('spawning enemy')
        this.spawnEnemy(this.spawnCounter)
        this.spawnCounter ++
      })
    )
  }

  isFrozen() {
    return this.statusEffects.indexOf('slow') > -1
  }

  isPoisoned() {
    return this.statusEffects.indexOf('dot') > -1
  }

  isDead() {
    return this.hp <= 0
  }

  // TODO: spawn additional enemy/enemies when health is low
  async takeDmg(dmg: number, atkSpeed: number, statusEffects: any) {
    // don't allow enemy to take damage after it's dead
    if ( this.isDead() ) { return null }

    log("player dealt "+ dmg + " damage to Spawner")
    utils.setTimeout(atkSpeed, ()=> {
      this.hp -= dmg
      this.soundLibrary.play('enemy_hit')

      if ( this.isDead() ) {
        this.soundLibrary.play('portal_close')

        engine.removeEntity(this) // TODO trigger death animation
      } else {
        this.statusEffectResolver.resolve(this, statusEffects)
      }
    })
  }

  spawnEnemy(id: number) {
    const t = this.getComponent(Transform)
    let n = new Transform()
    n.position.copyFrom(t.position)
    n.position.y = 0 // ground level
    n.rotation.copyFrom(t.rotation)

    new SkeletonEnemy(
      new GLTFShape('models/skelly.glb'), // TODO: model library like soundLibrary
      'enemy-skelly-'+ this.name +'-'+ id,
      this.scene,
      this.soundLibrary,
      this.statusEffectResolver,
      n
    )
  }
}
