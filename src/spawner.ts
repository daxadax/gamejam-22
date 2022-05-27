import * as utils from '@dcl/ecs-scene-utils'

import { Scene } from './scene'
import { SoundLibrary } from './soundLibrary'
import { EnemyModel } from './enemyModel'

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
    model: GLTFShape,
    name: string,
    scene: Scene,
    soundLibrary: SoundLibrary,
    transform: Transform
  ) {
    super(name)
    engine.addEntity(this)
    this.setParent(scene)
    this.addComponent(transform)

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
        // TODO: this logic should instead respond
        // to the total enemies currently in combat
        if ( this.spawnCounter === this.maxEnemies ) { return null }
        log('spawning enemy')
        this.spawnEnemy()
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

  spawnEnemy() {
    new EnemyModel(
      new GLTFShape('models/skelly_with_collider.glb'), // TODO: model library like soundLibrary
      'skelly',
      this.scene,
      this.soundLibrary,
      new Transform({
        position: new Vector3(31, 0.3, 23),
        rotation: new Quaternion(0, 180, 0, 1),
        scale: new Vector3(1, 1, 1)
      })
    )
  }
}
