import * as utils from '@dcl/ecs-scene-utils'

import { Button } from './button'
import { GameIntroduction } from './gameIntroduction'
import { Player } from './player'
import { PlayerUI } from './playerUI'
import { SkillUpgrades } from './skillUpgrades'
import { SoundLibrary } from './soundLibrary'
import { SpawnHelper } from './spawnHelper'
import { Spell } from './spell'

export class GameUI {
  canvas: UICanvas
  player: Player
  playerUI: PlayerUI
  skillUpgradesComponent: SkillUpgrades
  soundLibrary: SoundLibrary
  spellLibrary: Spell[]

  private screenCover: UIContainerRect
  private colorFlash: UIContainerRect
  private text: UIText
  private textWrapper: UIImage
  btnNext: Button

  constructor(canvas, player, soundLibrary, spells: Spell[]) {
    this.canvas = canvas
    this.player = player
    this.soundLibrary = soundLibrary
    this.spellLibrary = spells

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

    // player ui
    this.playerUI = new PlayerUI(canvas, player, spells)

    // skill upgrades component
    this.skillUpgradesComponent = new SkillUpgrades(canvas, player, soundLibrary, spells)
  }

  flashColor(color: Color4, duration: number = 10) {
    const prevColor = this.screenCover.color

    this.colorFlash.color = color
    this.colorFlash.visible = true

    utils.setTimeout(duration, ()=> {
      this.colorFlash.visible = false
    })
  }

  show() {
    this.screenCover.visible = true
    this.btnNext.visible = true
  }

  hide() {
    this.screenCover.visible = false
    this.btnNext.visible = false
  }

  editText(text: string) {
    this.text.value = text
  }

  selectNewSkills(spawnHelper: SpawnHelper) {
    // hide playerUI
    this.playerUI.hide()

    // show UI elements
    this.show()
    this.skillUpgradesComponent.show()

    this.btnNext.onClick = new OnClick(() => {
      // play sound
      this.soundLibrary.play('button_click')

      // hide existing components
      this.hide()
      this.skillUpgradesComponent.hide()

      // display playerUI
      this.playerUI.show()

      // TODO: i hate that this is here but i haven't found a better way to ensure
      // that the next wave is called only after the player has chosen upgrades
      //
      // start next wave
      spawnHelper.startNextWave()
    })
  }

  // // NOT CURRENTLY USED
  // toggleSkillUpgradeDisplay() {
  //   if ( this.skillUpgradesComponent.visible() ) {
  //     // hide UI elements
  //     this.hide()
  //     this.skillUpgradesComponent.hide()

  //     // show playerUI
  //     this.playerUI.show()
  //   } else {
  //     // hide playerUI
  //     this.playerUI.hide()

  //     // show UI elements
  //     this.show()
  //     this.skillUpgradesComponent.show()
  //   }
  // }
}
