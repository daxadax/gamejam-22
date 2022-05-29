import { GameUI } from './gameUI'
import { Player } from './player'
import { Spell } from './spell'
import { SoundLibrary } from './soundLibrary'
import { Scene } from './scene'

import { PlayerActionHelper } from './playerActionHelper'
import { SpawnHelper } from './spawnHelper'
import { SpellHelper } from './spellHelper'

import { EnemyActionSystem } from './enemyActionSystem'

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

// UI and helpers
const gameUI        = new GameUI(canvas, player, soundLibrary, spells)
const playerHelper  = new PlayerActionHelper(player, gameUI)
const spawnHelper   = new SpawnHelper(scene, soundLibrary)
const spellHelper   = new SpellHelper(camera, physicsCast, playerHelper)

// run initializers
scene.initialize()
scene.buildStaticModels()
gameUI.displayIntroduction()
player.initialize()
player.restrictMovement()
playerHelper.startRegeneration()

engine.addSystem(new EnemyActionSystem(camera, playerHelper))

// TODO: start spawn after entering tomb
spawnHelper.createSpawners(1)

input.subscribe("BUTTON_DOWN", ActionButton.POINTER, false, (e) => {
  selectNextSpell()
})

input.subscribe("BUTTON_DOWN", ActionButton.PRIMARY, true, (target) => {
  if ( player.stats.mana >= player.activeSpell.manaCost ) {
    spellHelper.castActiveSpell(player.activeSpell, target)
  } else {
    log("bro, although mana is a renewable resource, conservation is paramount")
  }
})

input.subscribe("BUTTON_DOWN", ActionButton.SECONDARY, false, (e) => {
  gameUI.toggleSkillUpgradeDisplay()
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
