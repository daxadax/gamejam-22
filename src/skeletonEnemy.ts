import * as utils from '@dcl/ecs-scene-utils'

import { Scene } from './scene'
import { SoundLibrary } from './soundLibrary'
import { StatusEffectResolver } from './statusEffectResolver'

export class SkeletonEnemy extends Entity {
  soundLibrary: SoundLibrary
  statusEffectResolver: StatusEffectResolver
  dmg: number
  hp: number
  maxHp: number
  level: number
  statusEffects = []
  speed: number

  attackTimer: number = 0

  constructor(
    model: GLTFShape,
    name: string,
    level: number,
    scene: Scene,
    soundLibrary: SoundLibrary,
    statusEffectResolver: StatusEffectResolver,
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
    this.statusEffectResolver = statusEffectResolver

    this.level = level
    // TODO: would be nice to dynamically slow animations based on speed changes
    this.hp = 10 * ( this.level * 1.3 )
    this.maxHp = this.hp
    this.speed = 3 + ( this.level / 2 )
    this.dmg = 5 * (1.1 + this.level)

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
  // TODO: in same helper as above - popup damage dealt like warcraft
  async takeDmg(dmg: number, atkSpeed: number, statusEffects: any) {
    // don't allow enemy to take damage after it's dead
    if ( this.isDead() ) { return null }

    log("player dealt "+ dmg + " damage to Skeleton")
    log("Skeleton hp: "+ this.hp +"/"+ this.maxHp)
    utils.setTimeout(atkSpeed, ()=> {
      this.hp -= dmg
      this.soundLibrary.play('enemy_hit')

      if ( this.isDead() ) {
        // TODO: this should be a different clip maybe?
        // it gets cut if called too frequently
        this.soundLibrary.play('enemy_die')

        // TODO: low priority
        // skeleton should rotate to face dmgSource before death animation is triggered
        this.getComponent(Animator).getClip('die').play()
        this.addComponentOrReplace(new utils.ExpireIn(2700))
      } else {
        this.statusEffectResolver.resolve(this, statusEffects)
      }
    })
  }
}
