import * as utils from '@dcl/ecs-scene-utils'

import { Scene } from './scene'
import { SoundLibrary } from './soundLibrary'

export class SkeletonEnemy extends Entity {
  soundLibrary: SoundLibrary
  dmg: number
  hp: number
  level: number = 1
  statusEffects = []
  speed: number

  attackTimer: number = 0

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

    transform.scale.x = 0.5
    transform.scale.y = 0.5
    transform.scale.z = 0.5
    this.addComponent(transform)

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

    this.soundLibrary = soundLibrary

    this.hp = 10 * this.level
    this.speed = 3 + this.level // TODO increase speed every x levels
    this.dmg = 5 * 1.2 * this.level

    return this
  }

  isFrozen() {
    return this.statusEffects.indexOf('slow') > -1
  }

  hasRecentlyAttacked(dt) {
    return this.attackTimer > 0
  }

  // For now, all attacks hit
  attack() {
    this.attackTimer = 1
    this.getComponent(Animator).getClip('attack').play()
  }

  walk() {
    this.getComponent(Animator).getClip('walk').play()
  }

  freeze() {
    this.getComponent(Animator).getClip('walk').speed = 0
  }

  decrementAttackTimer(time: number) {
    this.attackTimer -= time
  }

  // not used
  unfreeze() {
    this.getComponent(Animator).getClip('walk').speed = 1
  }

  async takeDmg(dmg: number, atkSpeed: number, statusEffects: any) {
    log("player dealt "+ dmg + " damage to Skeleton")
    utils.setTimeout(atkSpeed, ()=> {
      this.hp -= dmg
      this.soundLibrary.play('enemy_hit')

      if ( this.hp <= 0 ) {
        log('but i am le dead')

        // TODO: this should be a different clip maybe?
        // it gets cut if called too frequently
        this.soundLibrary.play('enemy_die')

        // TODO: low priority
        // skeleton should rotate to face dmgSource before death animation is triggered
        this.getComponent(Animator).getClip('die').play()
        this.addComponentOrReplace(new utils.ExpireIn(3000))
      } else {
        this.resolveStatusEffects(statusEffects)
      }
    })
  }

  resolveStatusEffects(statusEffects: any) {
    // handle slow (applied once)
    if ( statusEffects.slow > 0 && !this.isFrozen() ) {
      this.statusEffects.push('slow')
      this.speed -= statusEffects.slow

      if ( this.speed <= 0 ) { this.freeze() }
    }

    // handle knockback (applied on every hit)
    if ( statusEffects.knockback > 0 ) {
      const transform = this.getComponent(Transform)
      const backwardVector = Vector3.Backward().rotate(transform.rotation)
      const knockback = backwardVector.scale(statusEffects.knockback)

      transform.translate(knockback)
    }
  }
}
