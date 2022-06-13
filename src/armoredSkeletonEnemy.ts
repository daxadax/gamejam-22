import * as utils from '@dcl/ecs-scene-utils'

import { EnemyUI } from './enemyUI'
import { GameManager } from './gameManager'
import { Scene } from './scene'
import { SoundLibrary } from './soundLibrary'
import { StatusEffectResolver } from './statusEffectResolver'

export class ArmoredSkeletonEnemy extends Entity {
  soundLibrary: SoundLibrary
  statusEffectResolver: StatusEffectResolver
  enemyUI: EnemyUI
  dmg: number
  hp: number
  maxHp: number
  level: number
  statusEffects = []
  speed: number

  attackTimer: number = 0

  constructor(
    name: string,
    level: number,
    gameManager: GameManager,
    transform: Transform
  ) {
    super(name)
    engine.addEntity(this)
    this.setParent(gameManager.scene)

    transform.scale.x = 0.5
    transform.scale.y = 0.5
    transform.scale.z = 0.5
    this.addComponent(transform)

    const model = gameManager.modelLibrary.armoredSkeleton
    model.withCollisions = true
    model.isPointerBlocker = true
    model.visible = true
    this.addComponent(model)

    this.addComponent(new Animator())
    let walk = new AnimationState('walk', { layer: 0, looping: true })
    let bash = new AnimationState('attack', { layer: 0 })
    let die = new AnimationState('die', { layer: 0 })
    this.getComponent(Animator).addClip(walk)
    this.getComponent(Animator).addClip(bash)
    this.getComponent(Animator).addClip(die)
    walk.play()

    this.soundLibrary = gameManager.soundLibrary
    this.statusEffectResolver = gameManager.statusEffectResolver
    this.enemyUI = new EnemyUI(this)

    this.level = level
    // TODO: would be nice to dynamically slow animations based on speed changes
    this.hp = 20 * ( this.level * 1.3 )
    this.maxHp = this.hp
    this.speed = 2 + ( this.level / 2 )
    this.dmg = 6 * (1.1 + this.level)

    this.enemyUI.createLabel()
    this.updateLabel()

    return this
  }

  isSlowed() {
    return this.statusEffects.indexOf('slow') > -1
  }

  isFrozen() {
    return this.speed <= 0
  }

  isPoisoned() {
    return this.statusEffects.indexOf('dot') > -1
  }

  isDead() {
    return this.hp <= 0
  }

  hasRecentlyAttacked(dt) {
    return this.attackTimer > 0
  }

  // For now, all attacks hit
  attack() {
    this.attackTimer = 1.2
    this.getComponent(Animator).getClip('attack').play()
  }

  walk() {
    this.getComponent(Animator).getClip('walk').play()
  }

  freeze() {
    this.getComponent(Animator).getClip('walk').pause()
    this.getComponent(Animator).getClip('attack').pause()
  }

  decrementAttackTimer(time: number) {
    this.attackTimer -= time
  }

  // not used
  unfreeze() {
    this.getComponent(Animator).getClip('walk').speed = 1
  }

  // TODO: extract some concepts to a separate module which can be included in
  // various classes - a "damageHelper" maybe that could be used for the player
  // and enemies.
  async takeDmg(dmg: number, atkSpeed: number, statusEffects: any) {
    // don't allow enemy to take damage after it's dead
    if ( this.isDead() ) { return null }

    log("player dealt "+ dmg + " damage to Armored Skeleton")
    utils.setTimeout(atkSpeed, ()=> {
      this.hp -= dmg
      this.soundLibrary.play('enemy_hit')

      if ( this.isDead() ) {
        // TODO: this should be a different clip maybe?
        this.soundLibrary.play('enemy_die')

        // TODO: skeleton should rotate to face dmgSource before death animation is triggered
        this.getComponent(Animator).getClip('die').play()
        this.addComponentOrReplace(new utils.ExpireIn(2700))
      } else {
        this.statusEffectResolver.resolve(this, statusEffects)
      }

      this.updateLabel()
    })
  }

  updateLabel() {
    this.enemyUI.updateLabel("Armored Skeleton\n"+ this.hp +"/"+ this.maxHp +"hp")
  }
}
