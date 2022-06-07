import { PlayerActionHelper } from './playerActionHelper'
import { SkeletonEnemy } from './skeletonEnemy'
import { Spawner } from './spawner'
import { Spell } from './spell'
import { SpellLibrary } from './spellLibrary'

export class SpellHelper {
  camera: Camera
  physicsCast: PhysicsCast
  playerHelper: PlayerActionHelper
  spellLibrary: SpellLibrary

  constructor(camera, playerHelper, spellLibrary) {
    this.camera = camera
    this.physicsCast = PhysicsCast.instance
    this.playerHelper = playerHelper
    this.spellLibrary = spellLibrary
  }

  selectNextSpell() {
    const knownSpells = this.spellLibrary.knownSpells()
    let active = knownSpells.indexOf(this.playerHelper.player.activeSpell)

    // increment counter
    active++;

    // reset counter if we reach end of array
    if (active === knownSpells.length) { active = 0 }

    // update active spell
    this.playerHelper.setActiveSpell(knownSpells[active])
  }

  castActiveSpell(activeSpell: Spell, target: any) {
    let spellStats = this.playerHelper.activeSpellStats()
    let position = this.camera.position
    let rotation = this.camera.rotation
    let range = spellStats.range

    log('casting ', activeSpell.name, spellStats)

    let ray: Ray = {
      origin: position,
      direction: Vector3.Forward().rotate(rotation),
      distance: range
    }

    this.physicsCast.hitFirst(
      ray,
      (e) => {
        let origin  = new Vector3(position.x, position.y - 1, position.z)

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
              dot: spellStats.dot,
              knockback: spellStats.knockback,
              slow: spellStats.slow
            })
          } else if ( entityType === "Spawner" && enemy['hp'] > 0) {
            const spawner = enemy as Spawner

            spawner.takeDmg(spellStats.dmg, atkSpeed, {
              dot: spellStats.dot,
              slow: spellStats.slow
            })
          }
        } else {
          const target = origin.add(ray.direction.multiplyByFloats(range, range, range))

          // cast spell into the air like an idiot
          activeSpell.cast(origin, target, 200)
        }
      },
      1
    )
  }
}
