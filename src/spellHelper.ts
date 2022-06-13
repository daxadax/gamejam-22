import { GameUI } from './gameUI'
import { PlayerActionHelper } from './playerActionHelper'
import { SkeletonEnemy } from './skeletonEnemy'
import { Spawner } from './spawner'
import { Spell } from './spell'
import { SpellLibrary } from './spellLibrary'

export class SpellHelper {
  camera: Camera
  gameUI: GameUI
  physicsCast: PhysicsCast
  playerHelper: PlayerActionHelper
  spellLibrary: SpellLibrary

  constructor(gameManager) {
    this.camera       = gameManager.camera
    this.gameUI       = gameManager.gameUI
    this.physicsCast  = PhysicsCast.instance
    this.playerHelper = gameManager.playerHelper
    this.spellLibrary = gameManager.spellLibrary
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

  castActiveSpell(activeSpell: Spell) {
    const spellStats = this.playerHelper.activeSpellStats()
    const position = this.camera.position
    const rotation = this.camera.rotation
    const range = spellStats.range

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

          // notify headshot
          if ( isHeadshot ) { this.gameUI.notify('HEADSHOT!', 0.7, Color4.Red()) }

          // deal damage to enemy targets
          if ( ( entityType === "SkeletonEnemy" || "ArmoredSkeletonEnemy" ) && enemy['hp'] > 0) {
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
          const direction = Vector3.Zero().copyFrom(ray.direction)
          const target = origin.add(direction.multiplyByFloats(range, range, range))

          // recklessly cast spell into the air
          activeSpell.cast(origin, target, 200)
        }
      },
      1
    )
  }

  enemyMageCastSpell(spell: Spell, transform: Transform, target: Vector3) {
    const range = 32

    let origin = new Vector3(transform.position.x, 2, transform.position.z)
    let atkSpeed = 200

    // cast spell at target
    spell.cast(origin, target, 200)

    // deal damage to player on hit
    if ( this.isApproximateHit(target, this.camera.position) ) {
      this.playerHelper.takeDmg(spell.dmg)
    }
  }

  isApproximateHit(target: Vector3, currentPosition: Vector3) {
    return Math.round(target.x) === Math.round(currentPosition.x)
    && Math.round(target.z) === Math.round(currentPosition.z)
  }
}
