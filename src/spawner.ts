import * as utils from '@dcl/ecs-scene-utils'

import { EnemyUI } from './enemyUI'
import { GameManager } from './gameManager'
import { SoundLibrary } from './soundLibrary'
import { SkeletonEnemy } from './skeletonEnemy'
import { ArmoredSkeletonEnemy } from './armoredSkeletonEnemy'
import { StatusEffectResolver } from './statusEffectResolver'

export class Spawner extends Entity {
  gameManager: GameManager
  enemyUI: EnemyUI
  hp: number
  maxHp: number
  level: number
  maxEnemies: number
  enemyType: string
  soundLibrary: SoundLibrary
  spawnCounter: number = 0
  statusEffectResolver: StatusEffectResolver
  statusEffects = []
  speed = 4

  BASE_SPAWN_TIME = 4000
  MAX_TIME_OFFSET = 2000

  constructor(
    level: number,
    name: string,
    enemyType: string,
    gameManager: GameManager,
    transform: Transform
  ) {
    super(name)
    this.gameManager = gameManager
    this.soundLibrary = gameManager.soundLibrary
    this.statusEffectResolver = gameManager.statusEffectResolver
    this.enemyUI = new EnemyUI(this)

    engine.addEntity(this)
    this.setParent(this.gameManager.scene)
    this.addComponent(transform)

    const model = gameManager.modelLibrary.portal
    model.withCollisions = true
    model.isPointerBlocker = true
    model.visible = true
    this.addComponent(model)

    this.level = level
    this.hp = 100 + ( this.level * 15 )
    this.maxHp = this.hp
    this.maxEnemies = 5 + this.level
    this.enemyType = enemyType

    this.enemyUI.createLabel(new Transform({
      position: new Vector3(0, 3.5, -0.5)
    }))
    this.updateLabel()

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
        this.spawnEnemy()
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
    log("Spawner hp: "+ this.hp +"/"+ this.maxHp)
    utils.setTimeout(atkSpeed, ()=> {
      this.hp -= dmg
      this.soundLibrary.play('enemy_hit')

      if ( this.isDead() ) {
        this.soundLibrary.play('portal_close')

        engine.removeEntity(this)
      } else {
        this.statusEffectResolver.resolve(this, statusEffects)
      }
    })

    this.updateLabel()
  }

  spawnEnemy() {
    const t = this.getComponent(Transform)
    let transform = new Transform()
    transform.position.copyFrom(t.position)
    transform.position.y = 0 // ground level
    transform.rotation.copyFrom(t.rotation)

    if ( this.enemyType === 'skelly' ) { this.spawnSkeleton(transform) }
    if ( this.enemyType === 'armored_skelly' ) { this.spawnArmoredSkeleton(transform) }
  }

  spawnSkeleton(transform: Transform) {
    new SkeletonEnemy(
      'enemy-skelly-'+ this.name +'-'+ this.spawnCounter,
      this.level,
      this.gameManager,
      transform
    )
  }

  spawnArmoredSkeleton(transform: Transform) {
    new ArmoredSkeletonEnemy(
      'enemy-armored-skelly-'+ this.name +'-'+ this.spawnCounter,
      this.level,
      this.gameManager,
      transform
    )
  }

  updateLabel() {
    this.enemyUI.updateLabel("Portal\n"+ this.hp +"/"+ this.maxHp +"hp")
  }
}
