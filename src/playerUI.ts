import * as ui from '@dcl/ui-scene-utils'
import { UIBar } from '@dcl/ui-scene-utils'

import { Player } from './player'
import { SpellLibrary } from './spellLibrary'

export class PlayerUI {
  canvas: UICanvas
  player: Player
  spellLibrary: SpellLibrary

  private wrapper: UIContainerRect
  private brand: UIText
  private activeSpellWrapper: UIContainerRect
  private activeSpellImg: UIImage
  private activeSpellText: UIText
  private healthBar: UIBar
  private manaBar: UIBar

  constructor(canvas, player, spellLibrary) {
    this.player = player
    this.spellLibrary = spellLibrary

    this.wrapper = new UIContainerRect(canvas);
    // this.wrapper.color = Color4.Red()
    this.wrapper.width  = 300
    this.wrapper.height = 250
    this.wrapper.hAlign = 'right'
    this.wrapper.vAlign = 'top'
    this.wrapper.positionX = -5
    this.wrapper.positionY = 70
    this.wrapper.visible = false

    this.brand = new UIText(this.wrapper)
    this.brand.fontSize = 30
    this.brand.hAlign = 'left'
    this.brand.vAlign = 'top'
    this.brand.positionX = 5
    this.brand.positionY = 0
    this.brand.value = 'GAMEJAM \'22'

    this.activeSpellWrapper = new UIContainerRect(this.wrapper)
    // this.activeSpellWrapper.color = Color4.Yellow()
    this.activeSpellWrapper.width  = 300
    this.activeSpellWrapper.height = 100
    this.activeSpellWrapper.hAlign = 'left'
    this.activeSpellWrapper.vAlign = 'top'
    this.activeSpellWrapper.positionX = 0
    this.activeSpellWrapper.positionY = -55

    this.activeSpellImg = new UIImage(this.activeSpellWrapper, new Texture('assets/spell_map.png'))
    this.activeSpellImg.hAlign = 'left'
    this.activeSpellImg.vAlign = 'top'
    this.activeSpellImg.width = 200
    this.activeSpellImg.height = 50
    this.activeSpellImg.sourceWidth = 200
    this.activeSpellImg.sourceHeight = 50
    this.activeSpellImg.sourceTop = 200 // there is nothing at 200
    this.activeSpellImg.sourceLeft = 0

    this.activeSpellText = new UIText(this.activeSpellWrapper)
    this.activeSpellText.fontSize = 18
    this.activeSpellText.hAlign = 'left'
    this.activeSpellText.vAlign = 'top'
    this.activeSpellText.positionX = 50
    this.activeSpellText.positionY = -2

    this.healthBar = new ui.UIBar(1, -7, 595, Color4.Red(), ui.BarStyles.ROUNDWHITE, 0.75, true)
    this.manaBar = new ui.UIBar(1, -7, 572, Color4.Blue(), ui.BarStyles.ROUNDWHITE, 0.75, true)
  }

  setActiveSpell(name: string, level: number) {
    this.activeSpellImg.sourceTop = this.spellLibrary.getUIImage(name)
    this.activeSpellText.value = "LVL "+ level
  }

  incrementHp(amount: number) {
    this.healthBar.increase(amount / 100)
  }

  decrementHp(amount: number) {
    this.healthBar.decrease(amount / 100)
  }

  incrementMana(amount: number) {
    this.manaBar.increase(amount / 100)
  }

  decrementMana(amount: number) {
    this.manaBar.decrease(amount / 100)
  }

  show() {
    this.wrapper.visible = true
    this.healthBar.show()
    this.manaBar.show()
  }

  hide() {
    this.wrapper.visible = false
    this.healthBar.hide()
    this.manaBar.hide()
  }
}
