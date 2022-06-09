import * as utils from '@dcl/ecs-scene-utils'

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

  requirementText: UIText

  // each text container needs the same number of carraige returns for it to align properly. smh
  introText =
    "Making it all the way here would have been impossible without some kind of magical training. What do you know? \n\nYou start the game with 3 skill points but you'll gain more as you play. Spend them wisely!\n\n\n"
  instructions =
    " - Cast spells with the 'E' key.\n - Cycle through your available spells with the left mouse button. \n - Destroy all enemies and portals to complete the current wave and move on to the next.\n\n\n"

  constructor(gameUI, gameState, playerHelper, soundLibrary, spawnHelper) {
    this.gameState = gameState
    this.gameUI = gameUI
    this.playerHelper = playerHelper
    this.soundLibrary = soundLibrary
    this.spawnHelper = spawnHelper

    this.requirementText = new UIText(this.gameUI.canvas)
    this.requirementText.font = new Font(Fonts.SanFrancisco)
    this.requirementText.fontSize = 30
    this.requirementText.hAlign = "center"
    this.requirementText.vAlign = "top"
    this.requirementText.positionX = -222
    this.requirementText.positionY = -100
    this.requirementText.color = Color4.Red()
  }

  initialize() {
    this.gameUI.editText(this.introText)

    // ensure correct button positions / text
    this.gameUI.btnExit.hide()
    this.gameUI.btnNext.setPosition(0)
    this.gameUI.btnNext.setText('Continue')

    this.gameUI.btnNext.buttonComponent.onClick = new OnClick(() => {
      // play sound
      this.soundLibrary.play('button_click')

      // hide existing components
      this.gameUI.editText('')

      // show next component
      this.selectInitialSkills()
    })
  }

  selectInitialSkills() {
    // skill upgrade component
    this.gameUI.skillUpgradesComponent.container.positionY = 50
    this.gameUI.skillUpgradesComponent.show()

    // start game
    this.gameUI.btnNext.buttonComponent.onClick = new OnClick(() => {
      const spell = this.gameUI.spellLibrary.knownSpells().shift()
      if ( spell === undefined ) {
        this.selectInitialSkills()
        this.requirementText.value = "You must select at least one Spell"

        // TODO: this delay never triggers
        return new utils.Delay(3, ()=> {
          log('wtf')
          this.requirementText.value = ''
        })
      }

      // play sound
      this.soundLibrary.play('button_click')

      // hide existing components
      this.gameUI.editText('')
      this.gameUI.skillUpgradesComponent.hide()

      // set active spell
      this.playerHelper.setActiveSpell(spell)

      // TODO: remove if you can get delay working
      // remove requirement text on successful continue
      this.requirementText.value = null

      // show next component
      this.displayInstructions()
    })
  }

  displayInstructions() {
    this.gameUI.editText(this.instructions)

    this.gameUI.btnNext.buttonComponent.onClick = new OnClick(() => {
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
