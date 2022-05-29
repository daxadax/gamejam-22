import * as utils from '@dcl/ecs-scene-utils'

import { Scene } from './scene'
import { SoundLibrary } from './soundLibrary'

export class SkeletonEnemy extends Entity {
  soundLibrary: SoundLibrary
  dmg: number // this is more like dmg / frame so it should be low
  hp: number
  level: number = 1
  statusEffects = []
  speed: number

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
    this.dmg = 1 + (0.1 * this.level)

    return this
  }

  isFrozen() {
    return this.statusEffects.includes('slow')
  }

  attack() {
    this.getComponent(Animator).getClip('attack').play()
  }

  walk() {
    this.getComponent(Animator).getClip('walk').play()
  }

  freeze() {
    this.getComponent(Animator).getClip('walk').speed = 0
  }

  // not used
  unfreeze() {
    this.getComponent(Animator).getClip('walk').speed = 1
  }

  async takeDmg(dmg: number, atkSpeed: number, statusEffects: any) {
    setTimeout(() => {
      log("le ouch")
      this.hp -= dmg

      if ( this.hp <= 0 ) {
        log('but i am le dead')

        // TODO play death sound

        this.getComponent(Animator).getClip('die').play()
        this.addComponentOrReplace(new utils.ExpireIn(2000))
      }

      this.soundLibrary.play('enemy_hit')
      this.resolveStatusEffects(statusEffects)
    }, atkSpeed)
  }

  resolveStatusEffects(statusEffects: any) {
    log('status effects', statusEffects)
    // handle slow
    if ( statusEffects.slow > 0 && !this.statusEffects.includes('slow') ) {
      this.statusEffects.push('slow')
      this.speed -= statusEffects.slow

      if ( this.speed <= 0 ) {
        log('i should be frozen')
        this.freeze()
      }
    }

    // TODO: handle knockback
  }
}
