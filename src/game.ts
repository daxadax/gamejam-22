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

// high priority
// TODO: add boss spell casting
// TODO: balance skeletons (dmg + health)
// TODO: implement own health bars for player

// middle priority
// TODO: show status effects in enemy UI
// TODO: different boss music // sound effects
// TODO: freeze portals

// low priority
// TODO: build default onclick button event that can be added to
// TODO: enemy types with weaknesses
// TODO: load next-level portals so the user can choose which enemies they face
// TODO: rogue-like elements? (requires server)
