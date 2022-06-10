import * as ui from '@dcl/ui-scene-utils'
import * as utils from '@dcl/ecs-scene-utils'

import { Button } from './button'
import { GameIntroduction } from './gameIntroduction'
import { Player } from './player'
import { PlayerActionHelper } from './playerActionHelper'
import { PlayerUI } from './playerUI'
import { SkillUpgrades } from './skillUpgrades'
import { SoundLibrary } from './soundLibrary'
import { SpawnHelper } from './spawnHelper'
import { SpellLibrary } from './spellLibrary'

export class GameUI {
  canvas: UICanvas
  player: Player
  playerUI: PlayerUI
  skillUpgradesComponent: SkillUpgrades
  soundLibrary: SoundLibrary
  spellLibrary: SpellLibrary

  private screenCover: UIContainerRect
  private colorFlash: UIContainerRect
  private text: UIText
  private textWrapper: UIImage
  btnNext: Button
  btnExit: Button

  constructor(canvas, player, soundLibrary, spellLibrary) {
    this.canvas = canvas
    this.player = player
    this.soundLibrary = soundLibrary
    this.spellLibrary = spellLibrary

    // background
    this.screenCover = new UIContainerRect(canvas)
    this.screenCover.width = "100%"
    this.screenCover.height = "125%"
    this.screenCover.color = new Color4(0, 0, 0, 0.9)
    this.screenCover.isPointerBlocker = false
    this.screenCover.visible = false

    // color flash
    this.colorFlash = new UIContainerRect(canvas)
    this.colorFlash.width = "100%"
    this.colorFlash.height = "125%"
    this.colorFlash.isPointerBlocker = false
    this.colorFlash.visible = false

    // text wrapper
    this.textWrapper = new UIImage(this.screenCover, new Texture('assets/textWrapper.png'))
    this.textWrapper.width = 900
    this.textWrapper.height = 604
    this.textWrapper.sourceWidth = 900
    this.textWrapper.sourceHeight = 604
    this.textWrapper.sourceTop = 0
    this.textWrapper.sourceLeft = 0
    this.textWrapper.vAlign = "top"
    this.textWrapper.positionY = -60

    // ui text component
    this.text = new UIText(this.textWrapper)
    this.text.adaptWidth = false
    this.text.textWrapping = true
    this.text.width = "80%"
    this.text.font = new Font(Fonts.SanFrancisco)
    this.text.fontSize = 20
    this.text.hAlign = "center"
    this.text.vAlign = "top"
    this.text.positionY = -220
    this.text.color = Color4.Black()

    // default btn
    this.btnNext = new Button(this.canvas)

    // exit btn
    // TODO: pad button with required spaces dynamically in button class
    this.btnExit = new Button(this.canvas, '  I\'m out')
    this.btnExit.setPosition(-120)
    this.btnExit.buttonComponent.onClick = new OnClick(() => {
      // play sound
      this.soundLibrary.play('button_click')

      // unrestrict movement
      this.player.unrestrictMovement()

      // don't load resources and remove UI
      this.hide()
    })
    this.btnExit.hide()

    // player ui
    this.playerUI = new PlayerUI(canvas, player, spellLibrary)

    // skill upgrades component
    this.skillUpgradesComponent = new SkillUpgrades(canvas, player, soundLibrary, spellLibrary)
  }

  async flashColor(color: Color4, duration: number = 10) {
    this.colorFlash.color = color
    this.colorFlash.visible = true

    utils.setTimeout(duration, ()=> {
      this.colorFlash.visible = false
    })
  }

  show() {
    // ensure colorFlash is not visible - not sure why it would be but it shows
    // up on the 'game over' screen for some reason
    this.colorFlash.visible = false
    this.screenCover.visible = true
    this.btnNext.show()
  }

  hide() {
    this.screenCover.visible = false
    this.btnNext.hide()
    this.btnExit.hide()
  }

  editText(text: string) {
    this.text.value = text
  }

  notify(text: string, duration?: number, color?: Color4) {
    duration ||= 3
    color ||= Color4.White()

    ui.displayAnnouncement(text, duration, color)
  }

  displayPlayerChoice() {
    const introText =
    "After years of seeking, you've finally found it: the fabled tomb of the evil Archmage Bobby Bubonic. Your whole life has led you here and while you can't anticipate how things will end, you know it's your only chance to save your village / gain limitless power / get enough gold to pay for little timmy's operation. \n\nAre you ready?"

    this.show()
    this.editText(introText)

    this.btnNext.setPosition(120)
    this.btnNext.setText(' Let\'s go!')

    this.btnExit.show()
  }

  selectNewSkills(spawnHelper: SpawnHelper, playerHelper: PlayerActionHelper) {
    // hide playerUI
    this.playerUI.hide()

    // ensure correct button positions / text
    this.btnExit.hide()
    this.btnNext.setPosition(0)
    this.btnNext.setText('Continue')

    // show UI elements
    this.show()
    this.skillUpgradesComponent.show()

    this.btnNext.buttonComponent.onClick = new OnClick(() => {
      // play sound
      this.soundLibrary.play('button_click')

      // hide existing components
      this.hide()
      this.skillUpgradesComponent.hide()

      // display playerUI
      this.playerUI.show()

      // NOTE: could do this the same way as display player choice where the
      // button is configured by whoever calls it
      // TODO: i hate that this is here but i can't figure out a better way to
      // handle callbacks so that these functions are only called after the
      // button is clicked (ie, player is finished selecting skills)

      // start next wave
      spawnHelper.startNextWave()

      // start player regeneration
      playerHelper.startRegeneration()
    })
  }

  displayGameOver() {
    // hide playerUI
    this.playerUI.hide()

    // show UI elements
    this.show()
    this.editText("As you slip into blackness you faintly hear a deep voice say 'I win again'. Unfortunately you find yourself quite dead. What do?")

    this.btnNext.setPosition(120)
    this.btnNext.setText('Try again')

    this.btnExit.show()
  }
}
