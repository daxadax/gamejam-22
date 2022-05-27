import { Button } from './button'
import { Player } from './player'
import { SoundLibrary } from './soundLibrary'
import { Spell } from './spell'

export class SkillUpgrades {
  container: UIContainerRect
  player: Player

  private purchaseButton: Button
  private skillInfoImg: UIImage
  private skillInfoText: UIText
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
    this.container.positionX = -120
    this.container.positionY = 0
    this.container.isPointerBlocker = true
    this.container.visible = false

    this.skillInfoImg = new UIImage(this.container, new Texture('assets/spell_info_map.png'))
    this.skillInfoImg.width = 150
    this.skillInfoImg.height = 200
    this.skillInfoImg.sourceWidth = 150
    this.skillInfoImg.sourceHeight = 200
    this.skillInfoImg.sourceTop = 0
    this.skillInfoImg.sourceLeft = 0
    this.skillInfoImg.positionX = 375
    this.skillInfoImg.positionY = -10

    this.skillInfoText = new UIText(this.skillInfoImg)
    this.skillInfoText.fontSize = 12
    this.skillInfoText.hAlign = 'center'
    this.skillInfoText.vAlign = 'top'
    this.skillInfoText.positionX = -10
    this.skillInfoText.positionY = 0
    this.skillInfoText.color = Color4.Black()
    this.skillInfoText.isPointerBlocker = false

    this.purchaseButton = new Button(this.container, 'purchase')
    this.purchaseButton.positionX = 375
    this.purchaseButton.positionY = -140
    this.purchaseButton.visible = false

    this.skillPointsCounter = new UIText(this.container)
    this.skillPointsCounter.value = player.skillPoints +" skill points available"
    this.skillPointsCounter.fontSize = 15
    this.skillPointsCounter.positionX = 350
    this.skillPointsCounter.positionY = -160
    this.skillPointsCounter.color = Color4.Black()
    this.skillPointsCounter.isPointerBlocker = false
  }

  show() {
    // spells
    let blizzard = new SkillUpgrade(this.container, 'blizzard')
    blizzard.positionX = -185
    blizzard.positionY = -10
    blizzard.onClick = new OnClick(() => {
      log('blizzard')
      this.soundLibrary.play('button_click')
      this.showPurchaseWindow('blizzard', 'spell')
    })

    let vines = new SkillUpgrade(this.container, 'vines')
    vines.positionX = -45
    vines.positionY = -10
    vines.onClick = new OnClick(() => {
      log('vines')
      this.soundLibrary.play('button_click')
      this.showPurchaseWindow('vines', 'spell')
    })

    let fireball = new SkillUpgrade(this.container, 'fireball')
    fireball.positionX = 95
    fireball.positionY = -10
    fireball.onClick = new OnClick(() => {
      log('fireball')
      this.soundLibrary.play('button_click')
      this.showPurchaseWindow('fireball', 'spell')
    })

    let storm = new SkillUpgrade(this.container, 'storm')
    storm.positionX = 235
    storm.positionY = -10
    storm.onClick = new OnClick(() => {
      log('storm')
      this.soundLibrary.play('button_click')
      this.showPurchaseWindow('storm', 'spell')
    })

    // buffs
    let maxMana = new SkillUpgrade(this.container, 'maxMana')
    maxMana.positionX = -185
    maxMana.positionY = -125
    maxMana.onClick = new OnClick(() => {
      log('maxMana')
      this.soundLibrary.play('button_click')
      this.showPurchaseWindow('maxMana', 'skill', 'Max MP')
    })

    let maxHp = new SkillUpgrade(this.container, 'maxHp')
    maxHp.positionX = -45
    maxHp.positionY = -125
    maxHp.onClick = new OnClick(() => {
      log('maxHp')
      this.soundLibrary.play('button_click')
      this.showPurchaseWindow('maxHp', 'skill', 'Max HP')
    })

    let dmg = new SkillUpgrade(this.container, 'dmg')
    dmg.positionX = 95
    dmg.positionY = -125
    dmg.onClick = new OnClick(() => {
      log('dmg')
      this.soundLibrary.play('button_click')
      this.showPurchaseWindow('dmgBonus', 'skill', 'Damage Bonus')
    })

    let range = new SkillUpgrade(this.container, 'range')
    range.positionX = 235
    range.positionY = -125
    range.onClick = new OnClick(() => {
      log('range')
      this.soundLibrary.play('button_click')
      this.showPurchaseWindow('rangeBonus', 'skill', 'Range Bonus')
    })

    // show initial purchase window
    this.showPurchaseWindow('blizzard', 'spell')
    this.container.visible = true
  }

  hide() {
    this.container.visible = false
  }

  showPurchaseWindow(skill: string, type: string, displayName: string = null) {
    this.purchaseButton.visible = true
    this.showSkillInfo(skill, type, displayName)

    this.purchaseButton.onClick = new OnClick(() => {
      log('buying '+ skill)
      this.soundLibrary.play('upgrade_skill')

      if ( type === 'spell' ) {
        this.spells.find(spell => spell.name === skill).incrementLevel()
      } else {
        this.player.incrementStat(skill)
      }


      let remainingSkillPoints = this.player.decrementSkillPoints(1)
      this.skillPointsCounter.value = remainingSkillPoints +" skill points available"

      // refresh skill info window
      this.showSkillInfo(skill, type, displayName)

      if ( remainingSkillPoints === 0 ) {
        this.purchaseButton.visible = false
        // TODO: show unclickable button
      }
    })
  }

  // TODO: don't build full upgrade text if spell if at 0 level
  // should just be "next level: dmg: 10" not "next lvl: dmg 10 -> x"
  showSkillInfo(skill: string, type: string, displayName: string = null) {
    let el = null
    let text = ""
    let upgradeText = ""

    if ( type === 'spell' ) {
      displayName = skill.toUpperCase()
      el = this.spells.find(spell => spell.name === skill)
      text = "Level: "+ el.level

      // add a new line since spells have multiple attributes to upgrade
      upgradeText += "\n"

      // build upgrade text
      let stats = el.stats()
      Object.keys(stats['current']).forEach(function(key) {
        if ( stats['next'][key] != 0 && key != 'level' ) {
          // ex: "knockback: 1 -> 2\n"
          upgradeText += key +": "+ stats['current'][key] +" -> "+ stats['next'][key] +"\n"
        }
      })
    } else {
      el = this.player.stats[skill]
      text = "Current value: "+ el

      upgradeText = el + this.player.statIncrementMap[skill]
    }

    this.skillInfoText.value = displayName +"\n"+ text +"\n\nNext level:"+ upgradeText
  }
}

class SkillUpgrade extends UIImage {
  width: number = 125
  height: number = 80
  hAlign: string = 'center'
  vAlign: string = 'top'
  positionX: number = 0
  positionY: number = 0
  sourceTop: number = 0
  sourceLeft: number = 0
  sourceWidth: number = 125
  sourceHeight: number = 80
  isPointerBlocker: true

  skillImgMap = {
    'blizzard': [0,0],
    'vines': [125,0],
    'fireball': [250,0],
    'storm': [375,0],
    'maxMana': [0,80],
    'maxHp': [125,80],
    'dmg': [250,80],
    'range': [375,80]
  }

  constructor(parent: UIContainerRect, skill: string) {
    super(parent, new Texture("assets/skill_upgrade_map.png"))

    let source = this.skillImgMap[skill]
    this.sourceLeft = source[0]
    this.sourceTop = source[1]
  }
}
