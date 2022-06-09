import { GameManager } from './gameManager'
import { Player } from './player'

// GAME LOOP
const player      = new Player()
const gameManager = new GameManager(player)

gameManager.initialize()

// INPUT EVENTS
const input = Input.instance

input.subscribe("BUTTON_DOWN", ActionButton.POINTER, false, (e) => {
  if ( gameManager.gameState.isStarted ) {
    gameManager.spellHelper.selectNextSpell()
  }
})

input.subscribe("BUTTON_DOWN", ActionButton.PRIMARY, true, (target) => {
  if ( player.stats.mana >= player.activeSpell.manaCost ) {
    gameManager.spellHelper.castActiveSpell(player.activeSpell, target)
  }
})

// TODO: show status effects in enemy UI
// TODO: build default onclick button event that can be added to
// TODO: maybe the scene is initialized or there is a heavy fog as the only
// model loaded when you enter the scene - if you choose to play, the full scene
// loads and the fog disappears
// TODO: enemy types with weaknesses
// TODO: load next-level portals so the user can choose which enemies they face
// TODO: rogue-like elements? (requires server)
