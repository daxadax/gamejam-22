import { Button } from './button'
import { GameState } from './gameState'
import { GameUI } from './gameUI'
import { PlayerActionHelper } from './playerActionHelper'
import { SoundLibrary } from './soundLibrary'
import { SpawnHelper } from './spawnHelper'

export class GameIntroduction {
  gameUI: GameUI
  gameState: GameState
  playerHelper: PlayerActionHelper
  soundLibrary: SoundLibrary
  spawnHelper: SpawnHelper

  // each text container needs the same number of carraige returns for it to align properly. smh
  introText =
    "After years of seeking, you've finally found it: the fabled tomb of the evil Archmage Bobby Bubonic. Your whole life has led you here and while you can't anticipate how things will end, you know it's your only chance to save your village / gain limitless power / get enough gold to pay for little timmy's operation. \n\nAre you ready?"
  introText2 =
    "Making it all the way here would have been impossible without some kind of magical training. What do you know? \n\nYou start the game with 3 skill points but you'll gain more as you play. Spend them wisely!\n\n\n"
  instructions =
    "Cast spells with the 'E' key and cycle through your available spells with the left mouse button. Destroy all enemies and portals to complete the current wave and move on to the next.\n\n\n\n\n"

  constructor(gameUI, gameState, playerHelper, soundLibrary, spawnHelper) {
    this.gameUI = gameUI
    this.gameState = gameState
    this.playerHelper = playerHelper
    this.soundLibrary = soundLibrary
    this.spawnHelper = spawnHelper
  }

  initialize() {
    this.gameUI.show()
    this.gameUI.editText(this.introText)

    this.gameUI.btnNext.onClick = new OnClick(() => {
      // play sound
      this.soundLibrary.play('button_click')

      // show next component
      this.displayIntroductionTwo()
    })
  }

  displayIntroductionTwo() {
    this.gameUI.editText(this.introText2)

    this.gameUI.btnNext.onClick = new OnClick(() => {
      // play sound
      this.soundLibrary.play('button_click')

      // hide existing components
      this.gameUI.editText('')

      // show next component
      this.selectInitialSkills()
    })
  }

  // TODO: split spells and skills?
  selectInitialSkills() {
    // skill upgrade component
    this.gameUI.skillUpgradesComponent.container.positionY = 50
    this.gameUI.skillUpgradesComponent.show()

    // start game
    this.gameUI.btnNext.onClick = new OnClick(() => {
      // TODO: if player has selected at least one spell, continue
      //       otherwise reset skillpoints and say "you must select at least one spell"

      // play sound
      this.soundLibrary.play('button_click')

      // hide existing components
      this.gameUI.editText('')
      this.gameUI.skillUpgradesComponent.hide()

      // set active spell
      const spell = this.gameUI.spellLibrary.filter(spell => spell.level > 0).shift()
      this.playerHelper.setActiveSpell(spell)

      // show next component
      this.displayInstructions()
    })
  }

  displayInstructions() {
    this.gameUI.editText(this.instructions)

    this.gameUI.btnNext.onClick = new OnClick(() => {
      // play sound
      this.soundLibrary.play('button_click')

      // hide existing components
      this.gameUI.hide()
      this.gameUI.editText('')

      // display playerUI
      this.gameUI.playerUI.show()

      // allow player to move
      this.playerHelper.unrestrictMovement()

      // start player regen
      this.playerHelper.startRegeneration()

      // game has started
      this.gameState.startGame()
      this.gameState.incrementWave()

      // spawn initial wave
      this.spawnHelper.startNextWave()
    })
  }
}
