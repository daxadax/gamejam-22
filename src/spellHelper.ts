import { PlayerActionHelper } from './playerActionHelper'
import { Spell } from './spell'
import { SkeletonEnemy } from './skeletonEnemy'
import { Spawner } from './spawner'

export class SpellHelper {
  camera: Camera
  physicsCast: PhysicsCast
  playerHelper: PlayerActionHelper

  constructor(camera, physicsCast, playerHelper) {
    this.camera = camera
    this.physicsCast = physicsCast
    this.playerHelper = playerHelper
  }

  castActiveSpell(activeSpell: Spell, target: any) {
    let spellStats = this.playerHelper.activeSpellStats()
    let position = this.camera.position
    let rotation = this.camera.rotation

    log('casting ', activeSpell.name, spellStats)

    let ray: Ray = {
      origin: position,
      direction: Vector3.Forward().rotate(rotation),
      distance: spellStats.range
    }

    this.physicsCast.hitFirst(
      ray,
      (e) => {
        let origin  = new Vector3(position.x, position.y - 0.4, position.z)

        // decrement mana pool
        this.playerHelper.diminishMana(activeSpell.manaCost)

        if (e.didHit) {
          let enemy       = engine.entities[e.entity.entityId]
          let entityType  = enemy.constructor['name']
          let collider    = e.entity.meshName
          let target      = Vector3.Zero().copyFrom(e.hitPoint)
          let atkSpeed    = 200
          let isHeadshot  = /_head/.test(collider)

          // cast spell at target
          activeSpell.cast(origin, target, atkSpeed)

          if ( isHeadshot ) { log('HEADSHOT!') }

          // deal damage to enemy targets
          if ( entityType === "SkeletonEnemy" && enemy['hp'] > 0) {
            const skeleton = enemy as SkeletonEnemy
            const dmg = isHeadshot ? spellStats.dmg * 2 : spellStats.dmg

            skeleton.takeDmg(dmg, atkSpeed, {
              knockback: spellStats.knockback,
              slow: spellStats.slow
            })
          } else if ( entityType === "Spawner" && enemy['hp'] > 0) {
            const spawner = enemy as Spawner

            spawner.takeDmg(spellStats.dmg, atkSpeed)
          }
        } else {
          // cast spell into the air like an idiot
          // TODO: cast it straight forward for player range
          // activeSpell.cast(origin, Vector3.Forward(), 200)
        }
      },
      1
    )
  }
}
