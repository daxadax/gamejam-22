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
  private healthBar: UIBar
  private manaBar: UIBar

  constructor(canvas, player, spellLibrary) {
    this.player = player
    this.spellLibrary = spellLibrary

    this.wrapper = new UIContainerRect(canvas);
    // this.wrapper.color = Color4.Red()
    this.wrapper.width  = 300
    this.wrapper.height = 200
    this.wrapper.hAlign = 'center'
    this.wrapper.vAlign = 'bottom'
    this.wrapper.positionX = -10
    this.wrapper.positionY = -30
    this.wrapper.visible = false

    // this.brand = new UIText(this.wrapper)
    // this.brand.fontSize = 30
    // this.brand.hAlign = 'center'
    // this.brand.vAlign = 'bottom'
    // this.brand.positionX = -55
    // this.brand.positionY = 150
    // this.brand.value = 'GAMEJAM \'22'

    this.activeSpellWrapper = new UIContainerRect(this.wrapper)
    this.activeSpellWrapper.width  = 300
    this.activeSpellWrapper.height = 200
    this.activeSpellWrapper.hAlign = 'center'
    this.activeSpellWrapper.vAlign = 'bottom'
    this.activeSpellWrapper.positionX = 77
    this.activeSpellWrapper.positionY = -50

    this.activeSpellImg = new UIImage(this.activeSpellWrapper, new Texture('assets/element_map.png'))
    this.activeSpellImg.hAlign = 'left'
    this.activeSpellImg.vAlign = 'top'
    this.activeSpellImg.width = 150
    this.activeSpellImg.height = 150
    this.activeSpellImg.sourceWidth = 200
    this.activeSpellImg.sourceHeight = 200
    this.activeSpellImg.sourceTop = 0
    this.activeSpellImg.sourceLeft = 0

    this.healthBar = new ui.UIBar(1, -820, 0, Color4.Red(), ui.BarStyles.ROUNDBLACK, 1.7, true)
    this.manaBar = new ui.UIBar(1, -430, 0, Color4.Blue(), ui.BarStyles.ROUNDBLACK, 1.7, true)
  }

  setActiveSpell(name: string, level: number) {
    const coordinates = this.spellLibrary.getUIImage(name)
    this.activeSpellImg.sourceTop = coordinates[0]
    this.activeSpellImg.sourceLeft = coordinates[1]
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
