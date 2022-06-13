import * as utils from '@dcl/ecs-scene-utils'

import { EnemyUI } from './enemyUI'
import { GameManager } from './gameManager'
import { Scene } from './scene'
import { SoundLibrary } from './soundLibrary'
import { Spell } from './spell'
import { StatusEffectResolver } from './statusEffectResolver'

export class BossEnemy extends Entity {
  gameManager: GameManager
  soundLibrary: SoundLibrary
  statusEffectResolver: StatusEffectResolver
  enemyUI: EnemyUI
  dmg: number
  hp: number
  maxHp: number
  statusEffects = []
  speed: number
  spell: Spell

  attackTimer: number = 0

  constructor(
    model: GLTFShape,
    name: string,
    gameManager: GameManager,
    transform: Transform,
    delay: number
  ) {
    super(name)
    this.setParent(gameManager.scene)

    transform.scale.x = 2.5
    transform.scale.y = 2.5
    transform.scale.z = 2.5
    this.addComponent(transform)

    model.withCollisions = true
    model.isPointerBlocker = true
    model.visible = true

    this.addComponent(new Animator())
    let walk = new AnimationState('walk', { layer: 0, looping: true })
    let attack = new AnimationState('attack', { layer: 0 })
    let die = new AnimationState('die', { layer: 0 })
    this.getComponent(Animator).addClip(walk)
    this.getComponent(Animator).addClip(attack)
    this.getComponent(Animator).addClip(die)
    walk.play()

    this.gameManager = gameManager
    this.soundLibrary = gameManager.soundLibrary
    this.statusEffectResolver = gameManager.statusEffectResolver

    this.spell = new Spell('fireball', 'fireball.glb', this.soundLibrary, {})
    this.spell.dmg = 20

    // create health bar
    this.enemyUI = new EnemyUI(this)

    // TODO: would be nice to dynamically slow animations based on speed changes
    this.hp = 3000
    this.maxHp = this.hp
    this.speed = 6
    this.dmg = 6

    // delay adding entity to the game
    this.addComponent(new utils.Delay(delay, () => {
      engine.addEntity(this)
      this.addComponent(model)
      this.enemyUI.createHealthBar(gameManager.gameUI.canvas)
    }))

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

  castSpell(target: Vector3) {
    this.attackTimer = 3.5
    this.getComponent(Animator).getClip('attack').play()

    utils.setTimeout(1500, ()=>{
      this.gameManager.spellHelper.enemyMageCastSpell(this.spell, this.getComponent(Transform), target)
    })
  }

  blink() {
    this.getComponent(Animator).getClip('attack').stop()
    this.soundLibrary.play('blink')
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

    log("player dealt "+ dmg + " damage to Boss")
    utils.setTimeout(atkSpeed, ()=> {
      this.hp -= dmg
      this.soundLibrary.play('enemy_hit')

      if ( this.isDead() ) {
        // TODO: different clip for boss die // boss hit
        this.soundLibrary.play('enemy_die')

        // TODO: enemy should rotate to face dmgSource before death animation is triggered
        this.getComponent(Animator).getClip('die').play()
        this.addComponentOrReplace(new utils.ExpireIn(2300))

        // remove enemyUI
        this.enemyUI.removeHealthBar()

        // end game when boss dies
        this.gameManager.endGame('playerWin')
      } else {
        this.statusEffectResolver.resolve(this, statusEffects)
      }

      this.updateHealthBar()
    })
  }

  updateHealthBar() {
    this.enemyUI.updateHealthBar(this.hp, this.maxHp)
  }
}
