import { EnemyModel } from './enemyModel'
import { GameUI } from './gameUI'
import { Player } from './player'
import { PlayerActionHelper } from './playerActionHelper'
import { Spell } from './spell'
import { SoundLibrary } from './soundLibrary'
import { Scene } from './scene'
import { Spawner } from './spawner'

// Spells //
// Blizzard: Water damage [ Knockback ]
// Creeping vines: Earth damage [ Enemy SPD- ]
// Fireball: Fire damage [ DMG+ ]
// Storm: Lightning damage [ ATK SPD + ]

// set scene constants
const scene         = new Scene()
const camera        = Camera.instance
const canvas        = new UICanvas()
const input         = Input.instance
const physicsCast   = PhysicsCast.instance
const player        = new Player()
const soundLibrary  = new SoundLibrary()

// spells
const blizzard      = new Spell('blizzard', 'iceball.gltf', {'knockback': 1})
const vines         = new Spell('vines', 'poison.gltf', {'slow': 1})
const fireball      = new Spell('fireball', 'fireball.gltf', {'dmg': 2.5})
const storm         = new Spell('storm', 'trashy.gltf', {'atkSpeed': 1})
const spells        = [blizzard, vines, fireball, storm]

// game UI
const gameUI        = new GameUI(canvas, player, soundLibrary, spells)
const playerHelper  = new PlayerActionHelper(player, gameUI)


// test stuff
const spawner = new Spawner(
  new GLTFShape('models/skelly_with_collider.glb'),
  'spawner',
  scene,
  soundLibrary,
  new Transform({
    position: new Vector3(25, 0.3, 23),
    rotation: new Quaternion(0, 180, 0, 1),
    scale: new Vector3(1, 1, 1)
  })
)

// run initializers
scene.addModifiers()
scene.buildStaticModels()
gameUI.displayIntroduction()
player.initialize()
player.restrictMovement()
playerHelper.startRegeneration()

// TODO: start spawn after entering tomb
spawner.initialize()

input.subscribe("BUTTON_DOWN", ActionButton.POINTER, false, (e) => {
  selectNextSpell()
})

input.subscribe("BUTTON_DOWN", ActionButton.PRIMARY, true, (e) => {
  let activeSpell = player.activeSpell
  let spellStats = playerHelper.activeSpellStats()

  // can the player cast this spell in the first place?
  if ( player.stats.mana >= activeSpell.manaCost ) {
    log('casting ', activeSpell.name)
    log('stats', spellStats)

    let ray: Ray = {
      origin: camera.position,
      direction: Vector3.Forward().rotate(camera.rotation),
      distance: spellStats.range
    }

    physicsCast.hitFirst(
      ray,
      (e) => {
        let origin  = new Vector3(camera.position.x, camera.position.y - 0.4, camera.position.z)

        // decrement mana pool
        playerHelper.diminishMana(activeSpell.manaCost)

        if (e.didHit) {
          let enemy       = engine.entities[e.entity.entityId]
          let entityType  = enemy.constructor.name
          let target      = Vector3.Zero().copyFrom(e.hitPoint)
          let atkSpeed    = 200

          // cast spell at target
          activeSpell.cast(origin, target, atkSpeed)

          // deal damage to enemy targets
          if ( entityType === "EnemyModel" ) {
            // TODO: calculate headshots
            enemy.takeDmg(spellStats.dmg, atkSpeed, {
              knockback: spellStats.knockback,
              slow: spellStats.slow
            })
          } else if ( entityType === "Spawner" ) {
            enemy.takeDmg(spellStats.dmg, atkSpeed)
          }
        } else {
          log(e)
          // cast spell into the air like an idiot
          // TODO: cast it straight forward for player range
          // activeSpell.cast(origin, Vector3.Forward(), 200)
        }
      },
      1
    )
  } else {
    log("bro, do you even resource management?")
  }
})

input.subscribe("BUTTON_DOWN", ActionButton.SECONDARY, false, (e) => {
})

function selectNextSpell() {
  const knownSpells = spells.filter(spell => spell.level > 0) // TODO: add known spells cache to player
  let active = knownSpells.indexOf(player.activeSpell)

  // increment counter
  active++;

  // reset counter if we reach end of array
  if (active === knownSpells.length) { active = 0 }

  // update active spell
  playerHelper.setActiveSpell(knownSpells[active])
}
