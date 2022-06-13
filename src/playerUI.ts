import { GameManager } from './gameManager'
import { Player } from './player'
import { SpellLibrary } from './spellLibrary'

export class PlayerUI {
  BAR_MAX_WIDTH = 290

  player: Player
  spellLibrary: SpellLibrary

  private wrapper: UIContainerRect
  private brand: UIText
  private activeSpellWrapper: UIContainerRect
  private activeSpellImg: UIImage
  private activeSpellText: UIText
  private barsBg: UIContainerRect
  private healthBar: UIContainerRect
  private manaBar: UIContainerRect

  constructor(canvas: UICanvas, player: Player, spellLibrary: SpellLibrary) {
    this.player = player
    this.spellLibrary = spellLibrary

    this.wrapper = new UIContainerRect(canvas);
    this.wrapper.color = Color4.Black()
    this.wrapper.width  = 300
    this.wrapper.height = 150
    this.wrapper.hAlign = 'right'
    this.wrapper.vAlign = 'top'
    this.wrapper.positionX = -5
    this.wrapper.positionY = 70
    this.wrapper.visible = false

    // this.brand = new UIText(this.wrapper)
    // this.brand.fontSize = 30
    // this.brand.hAlign = 'center'
    // this.brand.vAlign = 'bottom'
    // this.brand.positionX = -55
    // this.brand.positionY = 150
    // this.brand.value = 'RIFT BATTLEGROUND'

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
    this.activeSpellImg.positionX = -80
    this.activeSpellImg.width = 240
    this.activeSpellImg.height = 70
    this.activeSpellImg.sourceWidth = 305
    this.activeSpellImg.sourceHeight = 100
    this.activeSpellImg.sourceTop = 0
    this.activeSpellImg.sourceLeft = 0

    this.activeSpellText = new UIText(this.activeSpellWrapper)
    this.activeSpellText.width = 200
    this.activeSpellText.font = new Font(Fonts.SanFrancisco)
    this.activeSpellText.fontSize = 15
    this.activeSpellText.vAlign = "top"
    this.activeSpellText.hAlign = "left"
    this.activeSpellText.positionX = 4
    this.activeSpellText.positionY = -8
    this.activeSpellText.color = Color4.White()

    this.barsBg = new UIContainerRect(this.wrapper)
    this.barsBg.width = this.BAR_MAX_WIDTH + 10
    this.barsBg.height = 90
    this.barsBg.vAlign = 'bottom'
    this.barsBg.hAlign = 'center'
    this.barsBg.positionY = 0
    this.barsBg.color = Color4.Black()
    this.barsBg.isPointerBlocker = false
    this.barsBg.visible = true

    this.healthBar = new UIContainerRect(this.barsBg)
    this.healthBar.width = this.BAR_MAX_WIDTH
    this.healthBar.height = 40
    this.healthBar.vAlign = 'top'
    this.healthBar.hAlign = 'left'
    this.healthBar.positionX = 5
    this.healthBar.positionY = -2.5
    this.healthBar.color = Color4.Red()
    this.healthBar.isPointerBlocker = false
    this.healthBar.visible = true

    this.manaBar = new UIContainerRect(this.barsBg)
    this.manaBar.width = this.BAR_MAX_WIDTH
    this.manaBar.height = 40
    this.manaBar.vAlign = 'top'
    this.manaBar.hAlign = 'left'
    this.manaBar.positionX = 5
    this.manaBar.positionY = -45
    this.manaBar.color = Color4.Blue()
    this.manaBar.isPointerBlocker = false
    this.manaBar.visible = true
  }

  reset() {
    this.healthBar.width = this.BAR_MAX_WIDTH
    this.manaBar.width = this.BAR_MAX_WIDTH
  }

  setActiveSpell(name: string, stats: any) {
    const activeStat = this.spellLibrary.getActiveStat(name)
    let activeStatText = ''

    if ( activeStat != undefined ) {
      const activeStatValue = stats[activeStat.toLowerCase()]
      activeStatText = "/ "+ activeStatValue +" "+ activeStat
    }

    log(stats)
    log(activeStatText)

    this.activeSpellImg.sourceTop = this.spellLibrary.getUIImage(name)
    this.activeSpellText.value = stats.dmg +" DMG "+ activeStatText
  }

  incrementHp(amount: number) {
    let currentHp = 1

    if ( (this.player.stats.hp + amount) < this.player.stats.maxHp ) {
      currentHp = (this.player.stats.hp + amount) / this.player.stats.maxHp
    }

    this.healthBar.width = currentHp * this.BAR_MAX_WIDTH
  }

  decrementHp() {
    this.healthBar.width = (this.player.stats.hp / this.player.stats.maxHp) * this.BAR_MAX_WIDTH
  }

  incrementMana(amount: number) {
    let currentMana = 1

    if ( (this.player.stats.mana + amount) < this.player.stats.maxMana ) {
      currentMana = (this.player.stats.mana + amount) / this.player.stats.maxMana
    }

    this.manaBar.width = currentMana * this.BAR_MAX_WIDTH
  }

  decrementMana() {
    this.manaBar.width = (this.player.stats.mana / this.player.stats.maxMana) * this.BAR_MAX_WIDTH
  }

  show() {
    this.wrapper.visible = true
  }

  hide() {
    this.wrapper.visible = false
  }
}
