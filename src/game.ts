import { GameIntroduction } from './gameIntroduction'
import { GameState } from './gameState'
import { GameUI } from './gameUI'
import { Player } from './player'
import { Scene } from './scene'
import { SoundLibrary } from './soundLibrary'
import { Spell } from './spell'

import { PlayerActionHelper } from './playerActionHelper'
import { SpawnHelper } from './spawnHelper'
import { SpellHelper } from './spellHelper'
import { StatusEffectResolver } from './statusEffectResolver'

import { EnemyActionSystem } from './enemyActionSystem'
import { GameLoopSystem } from './gameLoopSystem'

// Spells //
// TODO: enemy types with weaknesses
// TODO: better spell 3d models
// Blizzard: Ice damage [ slow enemy ]
// Poison: Earth damage [ poison enemy ]
// Fireball: Fire damage [ DMG+ ]
// Storm: Air damage [ knockback enemy ]

// set scene constants
const scene                 = new Scene()
const camera                = Camera.instance
const canvas                = new UICanvas()
const input                 = Input.instance
const physicsCast           = PhysicsCast.instance
const player                = new Player()
const soundLibrary          = new SoundLibrary()
const statusEffectResolver  = new StatusEffectResolver()

// spells
const blizzard      = new Spell('blizzard', 'iceball.gltf', soundLibrary, {'slow': 1})
const poison        = new Spell('poison', 'poison.gltf', soundLibrary, {'dot': 0.5})
const fireball      = new Spell('fireball', 'fireball.gltf', soundLibrary, {'dmg': 2.5})
const storm         = new Spell('storm', 'trashy.gltf', soundLibrary, {'knockback': 1})
const spells        = [blizzard, poison, fireball, storm]

// UI and helpers
const gameState     = new GameState()
const gameUI        = new GameUI(canvas, player, soundLibrary, spells)
const playerHelper  = new PlayerActionHelper(player, gameUI, soundLibrary)
const spawnHelper   = new SpawnHelper(gameState, scene, soundLibrary, statusEffectResolver)
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
  // if ( gameState.isStarted ) { gameUI.toggleSkillUpgradeDisplay() }
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
