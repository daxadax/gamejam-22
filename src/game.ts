import { GameManager } from './gameManager'
import { Player } from './player'

// GAME LOOP
const player      = new Player()
const gameManager = new GameManager(player)

gameManager.initialize()

// INPUT EVENTS
const input = Input.instance

input.subscribe("BUTTON_DOWN", ActionButton.PRIMARY, false, (e) => {
  if ( gameManager.gameState.isStarted ) {
    gameManager.spellHelper.selectNextSpell()
  }
})

input.subscribe("BUTTON_DOWN", ActionButton.POINTER, false, () => {
  if ( player.stats.mana >= player.activeSpell.manaCost ) {
    gameManager.spellHelper.castActiveSpell(player.activeSpell)
  }
})
