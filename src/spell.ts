import * as utils from '@dcl/ecs-scene-utils'

import { SoundLibrary } from './soundLibrary'

export class Spell extends Entity {
  soundLibrary: SoundLibrary

  bonusStats: any
  name: string
  level: number = 0
  manaCost: number = 10

  // default stats
  dmg: number = 5
  dot: number = 0
  knockback: number = 0
  range: number = 15
  slow: number = 0

  constructor(name, assetPath, soundLibrary, stats) {
    super()
    this.name = name
    this.soundLibrary = soundLibrary
    this.bonusStats = stats

    this.addComponent(new GLTFShape('models/'+ assetPath))
    this.addComponent(
      new Transform({
        position: Vector3.Zero(),
        scale: new Vector3(0.025, 0.025, 0.025)
      })
    )

    // add bonus stats
    this.dmg += stats.dmg || 0
    this.dot += stats.dot || 0
    this.knockback += stats.knockback || 0
    this.range += stats.range || 0
    this.slow += stats.slow || 0

    // add and immediately remove to init the model (idk why this works but it does)
    engine.addEntity(this)
    this.addComponentOrReplace(new utils.ExpireIn(1))
  }

  cast(startPosition: Vector3, endPosition: Vector3, speed: number) {
    log('casting spell at position:', endPosition)

    // Randomly rotate each projectile
     this.getComponent(Transform).rotate(Vector3.Forward(), Math.random() * 360)

    // cast projectile
    this.addComponentOrReplace(
      new utils.MoveTransformComponent(startPosition, endPosition, speed / 1000)
    )

    // play casting sound
    this.soundLibrary.play('spell_'+ this.name)

    engine.addEntity(this)
    this.addComponentOrReplace(new utils.ExpireIn(speed))
  }

  stats() {
    return {
      'current': {
        'level': this.level,
        'dmg': this.dmg,
        'dot': this.dot,
        'knockback': this.knockback,
        'range': this.range,
        'slow': this.slow
      },
      'next': {
        'level': this.level + 1,
        'dmg': this.dmg + (this.bonusStats.dmg || 1),
        'dot': this.dot + (this.bonusStats.dot || 0),
        'knockback': this.knockback + (this.bonusStats.knockback || 0),
        'range': this.range + (this.bonusStats.range || 0),
        'slow': this.slow + (this.bonusStats.slow || 0)
      }
    }
  }

  incrementLevel() {
    const lvlUp = this.stats()['next']
    const self = this

    Object.keys(lvlUp).forEach(function(key) {
      self[key] = lvlUp[key]
    })

    // TODO: decrease mana cost every x levels?
  }
}
