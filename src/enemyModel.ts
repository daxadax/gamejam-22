import { Scene } from './scene'
import { SoundLibrary } from './soundLibrary'

export class EnemyModel extends Entity {
  soundLibrary: SoundLibrary
  level: number = 1
  hp: number

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

    this.soundLibrary = soundLibrary

    this.hp = 10 * this.level

    return this
  }

  async takeDmg(dmg: number, atkSpeed: number, statusEffects: any) {
    setTimeout(() => {
      log("le ouch")
      this.hp -= dmg

      if ( this.hp <= 0 ) {
        log('but i am le dead')

        // TODO play death sound

        engine.removeEntity(this) // TODO trigger death animation
      }

      this.soundLibrary.play('enemy_hit')
      this.resolveStatusEffects(statusEffects)
    }, atkSpeed)
  }

  resolveStatusEffects(statusEffects: any) {
    log('status effects', statusEffects)
    // TODO: handle slow
    // TODO: handle knockback
  }
}
