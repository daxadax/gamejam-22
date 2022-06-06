import { GameManager } from './gameManager'
import { GameUI } from './gameUI'
import { Player } from './player'
import { SoundLibrary } from './soundLibrary'
import { SpellLibrary } from './spellLibrary'

const canvas        = new UICanvas()
const input         = Input.instance
const player        = new Player()
const soundLibrary  = new SoundLibrary()
const spellLibrary  = new SpellLibrary(soundLibrary)

const gameUI        = new GameUI(canvas, player, soundLibrary, spellLibrary)
const gameManager   = new GameManager(canvas, gameUI, player, soundLibrary, spellLibrary)

gameManager.initialize()

input.subscribe("BUTTON_DOWN", ActionButton.POINTER, false, (e) => {
  gameManager.spellHelper.selectNextSpell()
})

input.subscribe("BUTTON_DOWN", ActionButton.PRIMARY, true, (target) => {
  if ( player.stats.mana >= player.activeSpell.manaCost ) {
    gameManager.spellHelper.castActiveSpell(player.activeSpell, target)
  }
})

// TODO: show status effects in enemy UI
// TODO: build default onclick button event that can be added to
// TODO: game music - calmer for choosing skills // intense for gameplay
// TODO: maybe the scene is initialized or there is a heavy fog as the only
// model loaded when you enter the scene - if you choose to play, the full scene
// loads and the fog disappears
// TODO: enemy types with weaknesses
// TODO: load next-level portals so the user can choose which enemies they face
// TODO: rogue-like elements? (requires server)
