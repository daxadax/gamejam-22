import * as utils from '@dcl/ecs-scene-utils'

import { Scene } from './scene'
import { SoundLibrary } from './soundLibrary'
import { SkeletonEnemy } from './skeletonEnemy'

export class Spawner extends Entity {
  hp: number
  level: number = 1
  maxEnemies: number = 5
  scene: Scene
  soundLibrary: SoundLibrary
  spawnCounter: number = 0

  BASE_SPAWN_TIME = 4000
  MAX_TIME_OFFSET = 2000

  constructor(
    name: string,
    scene: Scene,
    soundLibrary: SoundLibrary,
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

    this.hp = 125 * this.level

    return this
  }

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

  // TODO: spawn additional enemy/enemies when health is low
  async takeDmg(dmg: number, atkSpeed: number) {
    setTimeout(() => {
      log("le ouch")
      this.hp -= dmg

      if ( this.hp <= 0 ) {
        log('but i am le dead')

        // TODO play death sound

        engine.removeEntity(this) // TODO trigger death animation
      }

      this.soundLibrary.play('enemy_hit')
    }, atkSpeed)
  }

  spawnEnemy(id: number) {
    const t = this.getComponent(Transform)
    let n = new Transform()
    n.position.copyFrom(t.position)
    n.rotation.copyFrom(t.rotation)

    new SkeletonEnemy(
      new GLTFShape('models/skelly.glb'), // TODO: model library like soundLibrary
      'enemy-skelly-'+ this.name +'-'+ id,
      this.scene,
      this.soundLibrary,
      n
    )
  }
}
