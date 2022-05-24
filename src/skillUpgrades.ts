import { Button } from './button'
import { Player } from './player'
import { SoundLibrary } from './soundLibrary'
import { Spell } from './spell'

export class SkillUpgrades {
  container: UIContainerRect
  player: Player

  private purchaseButton: Button
  private skillInfoImg: UIImage
  private skillPointsCounter: UIText
  private soundLibrary: SoundLibrary
  private spells: Spell[]

  constructor(parent: UICanvas, player: Player, soundLibrary: SoundLibrary, spells: Spell[]) {
    this.player = player
    this.soundLibrary = soundLibrary
    this.spells = spells

    this.container = new UIContainerRect(parent)
    this.container.width = 200
    this.container.height = 200
    this.container.hAlign = 'center'
    this.container.vAlign = 'center'
    this.container.positionX = -100
    this.container.positionY = 0
    this.container.isPointerBlocker = true
    this.container.visible = false

    this.skillInfoImg = new UIImage(this.container, new Texture('assets/spell_info_map.png'))
    this.skillInfoImg.width = 150
    this.skillInfoImg.height = 200
    this.skillInfoImg.sourceWidth = 150
    this.skillInfoImg.sourceHeight = 200
    this.skillInfoImg.sourceTop = 0 // there is nothing at 200
    this.skillInfoImg.sourceLeft = 0
    this.skillInfoImg.positionX = 375
    this.skillInfoImg.positionY = -10

    this.purchaseButton = new Button(this.container)
    this.purchaseButton.positionX = 375
    this.purchaseButton.positionY = -140
    this.purchaseButton.width = 165
    this.purchaseButton.height = 110
    this.purchaseButton.visible = false

    this.skillPointsCounter = new UIText(this.container)
    this.skillPointsCounter.value = player.skillPoints +" skill points available"
    this.skillPointsCounter.fontSize = 15
    this.skillPointsCounter.positionX = 350
    this.skillPointsCounter.positionY = -160
    this.skillPointsCounter.isPointerBlocker = false
  }

  show() {
    // spells
    let blizzard = new SkillUpgrade(this.container)
    blizzard.positionX = -175
    blizzard.onClick = new OnClick(() => {
      log('blizzard')
      this.soundLibrary.play('button_click')
      this.showPurchaseWindow('blizzard')
    })

    let vines = new SkillUpgrade(this.container)
    vines.positionX = -35
    vines.onClick = new OnClick(() => {
      log('vines')
      this.soundLibrary.play('button_click')
      this.showPurchaseWindow('vines')
    })

    let fireball = new SkillUpgrade(this.container)
    fireball.positionX = 105
    fireball.onClick = new OnClick(() => {
      log('fireball')
      this.soundLibrary.play('button_click')
      this.showPurchaseWindow('fireball')
    })

    let storm = new SkillUpgrade(this.container)
    storm.positionX = 245
    storm.onClick = new OnClick(() => {
      log('storm')
      this.soundLibrary.play('button_click')
      this.showPurchaseWindow('storm')
    })

    // buffs
    let mp = new SkillUpgrade(this.container)
    mp.positionX = -175
    mp.positionY = -140
    mp.onClick = new OnClick(() => {
      log('mp')
      this.soundLibrary.play('button_click')
      this.showPurchaseWindow('mp')
    })

    let hp = new SkillUpgrade(this.container)
    hp.positionX = -35
    hp.positionY = -140
    hp.onClick = new OnClick(() => {
      log('hp')
      this.soundLibrary.play('button_click')
      this.showPurchaseWindow('hp')
    })

    let dmg = new SkillUpgrade(this.container)
    dmg.positionX = 105
    dmg.positionY = -140
    dmg.onClick = new OnClick(() => {
      log('dmg')
      this.soundLibrary.play('button_click')
      this.showPurchaseWindow('dmg')
    })

    let range = new SkillUpgrade(this.container)
    range.positionX = 245
    range.positionY = -140
    range.onClick = new OnClick(() => {
      log('range')
      this.soundLibrary.play('button_click')
      this.showPurchaseWindow('range')
    })

    // show initial purchase window
    this.showPurchaseWindow('blizzard')
    this.container.visible = true
  }

  showPurchaseWindow(skill: string) {
    this.purchaseButton.visible = true
    this.purchaseButton.onClick = new OnClick(() => {
      log('buying '+ skill)
      this.soundLibrary.play('upgrade_skill')

      // TODO: add skill class and implement incrementLevel on it too
      this.spells.find(spell => spell.name === skill).incrementLevel()

      let remainingSkillPoints = this.player.decrementSkillPoints(1)
      this.skillPointsCounter.value = remainingSkillPoints +" skill points available"

      if ( remainingSkillPoints === 0 ) {
        this.purchaseButton.visible = false
        // TODO: show unclickable button
      }
    })
  }
}

class SkillUpgrade extends UIImage {
  width: number = 128
  height: number = 128
  hAlign: string = 'left'
  vAlign: string = 'top'
  positionX: number = 0
  positionY: number = 0
  sourceTop: number = 0
  sourceLeft: number = 0
  sourceWidth: number = 128
  sourceHeight: number = 128
  isPointerBlocker: true

  constructor(parent: UIContainerRect, asset_path: string = 'box_normal.png') {
    super(parent, new Texture("assets/"+ asset_path))
  }
}
