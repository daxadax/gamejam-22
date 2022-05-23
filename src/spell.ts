import * as utils from '@dcl/ecs-scene-utils'

export class Spell extends Entity {
  name: string
  level: number = 0
  manaCost: number = 10

  // default stats
  atkSpeed: number = 1
  dmg: number = 5
  knockback: number = 0
  range: number = 15
  slow: number = 0

  constructor(name: string, assetPath: string, stats: any) {
    super()
    this.name = name

    this.addComponent(new GLTFShape('models/'+ assetPath))
    this.addComponent(
      new Transform({
        position: Vector3.Zero(),
        scale: new Vector3(0.025, 0.025, 0.025)
      })
    )

    // add bonus stats
    this.atkSpeed += stats.atkSpeed || 0
    this.dmg += stats.dmg || 0
    this.knockback += stats.knockback || 0
    this.range += stats.range || 0
    this.slow += stats.slow || 0

    engine.addEntity(this)
    this.addComponentOrReplace(new utils.ExpireIn(1))
  }

  cast(startPosition: Vector3, endPosition: Vector3, speed: number) {
    log('casting spell at position:', endPosition)

    // Randomly rotate each projectile
     this.getComponent(Transform).rotate(Vector3.Forward(), Math.random() * 360)

    this.addComponentOrReplace(
      new utils.MoveTransformComponent(startPosition, endPosition, speed / 1000)
    )

    engine.addEntity(this)
    this.addComponentOrReplace(new utils.ExpireIn(speed))
  }

  viewStats() {
    return {
      'level': this.level,
      'atkSpeed': this.atkSpeed,
      'dmg': this.dmg,
      'knockback': this.knockback,
      'range': this.range,
      'slow': this.slow
    }
  }

  incrementLevel() {
    this.level ++
    this.dmg += this.dmg * 0.25
    // TODO: increment tagged attributes for spell type
    // TODO: decrease mana cost?
  }
}
