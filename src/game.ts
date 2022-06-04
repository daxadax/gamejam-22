import { GameIntroduction } from './gameIntroduction'
import { GameState } from './gameState'
import { GameUI } from './gameUI'
import { Player } from './player'
import { Scene } from './scene'
import { SoundLibrary } from './soundLibrary'
import { SpellLibrary } from './spellLibrary'

import { PlayerActionHelper } from './playerActionHelper'
import { SpawnHelper } from './spawnHelper'
import { SpellHelper } from './spellHelper'
import { StatusEffectResolver } from './statusEffectResolver'

import { EnemyActionSystem } from './enemyActionSystem'
import { GameLoopSystem } from './gameLoopSystem'

// TODO: enemy types with weaknesses

// minimum elements needed to start the game
const canvas        = new UICanvas()
const player        = new Player()
const soundLibrary  = new SoundLibrary()
const spellLibrary  = new SpellLibrary(soundLibrary)

// gameUI
const gameUI        = new GameUI(canvas, player, soundLibrary, spellLibrary)

// TODO: from here to input events go into a game manager class
// set scene constants
const camera                = Camera.instance
const gameState             = new GameState()
const input                 = Input.instance
const physicsCast           = PhysicsCast.instance
const scene                 = new Scene()
const statusEffectResolver  = new StatusEffectResolver()

// UI and helpers
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
engine.addSystem(new GameLoopSystem(gameUI, gameState, playerHelper, soundLibrary, spawnHelper))

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

// TODO: move to player helper
function selectNextSpell() {
  const knownSpells = spellLibrary.knownSpells()
  let active = knownSpells.indexOf(player.activeSpell)

  // increment counter
  active++;

  // reset counter if we reach end of array
  if (active === knownSpells.length) { active = 0 }

  // update active spell
  playerHelper.setActiveSpell(knownSpells[active])
}
