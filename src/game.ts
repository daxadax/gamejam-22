import { GameIntroduction } from './gameIntroduction'
import { GameState } from './gameState'
import { GameUI } from './gameUI'
import { Player } from './player'
import { Spell } from './spell'
import { SoundLibrary } from './soundLibrary'
import { Scene } from './scene'

import { PlayerActionHelper } from './playerActionHelper'
import { SpawnHelper } from './spawnHelper'
import { SpellHelper } from './spellHelper'

import { EnemyActionSystem } from './enemyActionSystem'
import { GameLoopSystem } from './gameLoopSystem'

// Spells //
// Blizzard: Water damage [ Knockback ]
// Creeping vines: Earth damage [ Slow Enemy ]
// Fireball: Fire damage [ DMG+ ]
// Storm: Lightning damage [ Attack speed+ ] // TODO: attack speed is lame

// set scene constants
const scene         = new Scene()
const camera        = Camera.instance
const canvas        = new UICanvas()
const input         = Input.instance
const physicsCast   = PhysicsCast.instance
const player        = new Player()
const soundLibrary  = new SoundLibrary()

// spells
const blizzard      = new Spell('blizzard', 'iceball.gltf', soundLibrary, {'knockback': 1})
const vines         = new Spell('vines', 'poison.gltf', soundLibrary, {'slow': 1})
const fireball      = new Spell('fireball', 'fireball.gltf', soundLibrary, {'dmg': 2.5})
const storm         = new Spell('storm', 'trashy.gltf', soundLibrary, {'atkSpeed': 1})
const spells        = [blizzard, vines, fireball, storm]

// UI and helpers
const gameState     = new GameState()
const gameUI        = new GameUI(canvas, player, soundLibrary, spells)
const playerHelper  = new PlayerActionHelper(player, gameUI, soundLibrary)
const spawnHelper   = new SpawnHelper(gameState, scene, soundLibrary)
const spellHelper   = new SpellHelper(camera, physicsCast, playerHelper)
const gameIntro     = new GameIntroduction(gameUI, gameState, playerHelper, soundLibrary, spawnHelper)

// run initializers
scene.initialize()
scene.buildStaticModels()
player.initialize()
player.restrictMovement()

// add systems
engine.addSystem(new EnemyActionSystem(camera, playerHelper))
engine.addSystem(new GameLoopSystem(gameUI, gameState, player, soundLibrary, spawnHelper))

// start game loop
gameIntro.initialize()

input.subscribe("BUTTON_DOWN", ActionButton.POINTER, false, (e) => {
  selectNextSpell()
})

input.subscribe("BUTTON_DOWN", ActionButton.PRIMARY, true, (target) => {
  if ( player.stats.mana >= player.activeSpell.manaCost ) {
    spellHelper.castActiveSpell(player.activeSpell, target)
  }
})

input.subscribe("BUTTON_DOWN", ActionButton.SECONDARY, false, (e) => {
  if ( gameState.isStarted ) { gameUI.toggleSkillUpgradeDisplay() }
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
