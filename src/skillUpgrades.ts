import { Button } from './button'
import { Player } from './player'
import { SoundLibrary } from './soundLibrary'
import { SpellLibrary } from './spellLibrary'

export class SkillUpgrades {
  container: UIContainerRect
  player: Player

  private purchaseButton: Button
  private skillInfoImg: UIImage
  private skillInfoText: UIText
  private skillInfoDescription: UIText
  private skillPointsCounter: UIText
  private soundLibrary: SoundLibrary
  private spellLibrary: SpellLibrary

  private blizzard: SkillUpgrade
  private fireball: SkillUpgrade
  private poison: SkillUpgrade
  private storm: SkillUpgrade

  private dmg: SkillUpgrade
  private maxHp: SkillUpgrade
  private maxMana: SkillUpgrade
  private range: SkillUpgrade

  descriptionMap = {
    blizzard: "A chilling spell that freezes enemies",
    poison: "A toxic cloud that does damage over time",
    fireball: "The classic fireball: deals massive damage",
    storm: "Whipping winds knockback your foes",
    maxMana: 'Increase your mana pool',
    maxHp: 'Increase your health',
    rangeBonus: 'Increase the range of all spells',
    dmgBonus: 'Increase the damage of all spells'
  }

  constructor(parent: UICanvas, player: Player, soundLibrary: SoundLibrary, spellLibrary: SpellLibrary) {
    this.player = player
    this.soundLibrary = soundLibrary
    this.spellLibrary = spellLibrary

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

    this.skillInfoDescription = new UIText(this.container)
    this.skillInfoDescription.fontSize = 24
    this.skillInfoDescription.hAlign = 'left'
    this.skillInfoDescription.vAlign = 'bottom'
    this.skillInfoDescription.positionX = -125
    this.skillInfoDescription.positionY = -55
    this.skillInfoDescription.color = Color4.Black()
    this.skillInfoDescription.isPointerBlocker = false

    this.skillInfoText = new UIText(this.skillInfoImg)
    this.skillInfoText.fontSize = 12
    this.skillInfoText.hAlign = 'center'
    this.skillInfoText.vAlign = 'top'
    this.skillInfoText.positionX = -10
    this.skillInfoText.positionY = -60
    this.skillInfoText.color = Color4.Black()
    this.skillInfoText.isPointerBlocker = false

    this.purchaseButton = new Button(this.container, 'purchase')
    this.purchaseButton.setPosition(375, -140)
    this.purchaseButton.hide()

    this.skillPointsCounter = new UIText(this.container)
    this.skillPointsCounter.value = player.skillPoints +" skill points available"
    this.skillPointsCounter.fontSize = 15
    this.skillPointsCounter.positionX = 350
    this.skillPointsCounter.positionY = -160
    this.skillPointsCounter.color = Color4.Black()
    this.skillPointsCounter.isPointerBlocker = false

    const imageMap = new Texture("assets/skill_upgrade_map.png")

    // spell slots
    this.blizzard = new SkillUpgrade(this.container, imageMap, 'blizzard')
    this.blizzard.positionX = -185
    this.blizzard.positionY = -10
    this.blizzard.onClick = new OnClick(() => {
      log('blizzard')
      this.soundLibrary.play('button_click')
      this.showPurchaseInfo('blizzard', 'spell')
    })

    this.fireball = new SkillUpgrade(this.container, imageMap, 'fireball')
    this.fireball.positionX = 95
    this.fireball.positionY = -10
    this.fireball.onClick = new OnClick(() => {
      log('fireball')
      this.soundLibrary.play('button_click')
      this.showPurchaseInfo('fireball', 'spell')
    })

    this.poison = new SkillUpgrade(this.container, imageMap, 'poison')
    this.poison.positionX = -45
    this.poison.positionY = -10
    this.poison.onClick = new OnClick(() => {
      log('poison')
      this.soundLibrary.play('button_click')
      this.showPurchaseInfo('poison', 'spell')
    })

    this.storm = new SkillUpgrade(this.container, imageMap, 'storm')
    this.storm.positionX = 235
    this.storm.positionY = -10
    this.storm.onClick = new OnClick(() => {
      log('storm')
      this.soundLibrary.play('button_click')
      this.showPurchaseInfo('storm', 'spell')
    })

    // buff slots
    this.dmg = new SkillUpgrade(this.container, imageMap, 'dmg')
    this.dmg.positionX = 95
    this.dmg.positionY = -125
    this.dmg.onClick = new OnClick(() => {
      log('dmg')
      this.soundLibrary.play('button_click')
      this.showPurchaseInfo('dmgBonus', 'skill', 'Damage Bonus')
    })

    this.maxHp = new SkillUpgrade(this.container, imageMap, 'maxHp')
    this.maxHp.positionX = -45
    this.maxHp.positionY = -125
    this.maxHp.onClick = new OnClick(() => {
      log('maxHp')
      this.soundLibrary.play('button_click')
      this.showPurchaseInfo('maxHp', 'skill', 'Max HP')
    })

    this.maxMana = new SkillUpgrade(this.container, imageMap, 'maxMana')
    this.maxMana.positionX = -185
    this.maxMana.positionY = -125
    this.maxMana.onClick = new OnClick(() => {
      log('maxMana')
      this.soundLibrary.play('button_click')
      this.showPurchaseInfo('maxMana', 'skill', 'Max MP')
    })

    this.range = new SkillUpgrade(this.container, imageMap, 'range')
    this.range.positionX = 235
    this.range.positionY = -125
    this.range.onClick = new OnClick(() => {
      log('range')
      this.soundLibrary.play('button_click')
      this.showPurchaseInfo('rangeBonus', 'skill', 'Range Bonus')
    })
  }

  visible() {
    return this.container.visible
  }

  show() {
    // show initial purchase window
    this.showPurchaseInfo('blizzard', 'spell')
    this.skillPointsCounter.value = this.player.skillPoints +" skill points available"
    this.container.visible = true
  }

  hide() {
    this.container.visible = false
  }

  showPurchaseInfo(skill: string, type: string, displayName: string = null) {
    const purchaseButton = this.purchaseButton

    purchaseButton.show()
    this.showSkillInfo(skill, type, displayName)

    if ( this.player.skillPoints === 0 ) {
      purchaseButton.disable()
      purchaseButton.buttonComponent.onClick = null
    } else {
      purchaseButton.enable()

      purchaseButton.buttonComponent.onClick = new OnClick(() => {
        log('buying '+ skill)
        this.soundLibrary.play('upgrade_skill')

        if ( type === 'spell' ) {
          this.spellLibrary.spells[skill].incrementLevel()
        } else {
          this.player.incrementStat(skill)
        }

        let remainingSkillPoints = this.player.decrementSkillPoints(1)
        this.skillPointsCounter.value = remainingSkillPoints +" skill points available"

        // refresh skill info window
        this.showSkillInfo(skill, type, displayName)

        if ( remainingSkillPoints === 0 ) {
          purchaseButton.disable()
          purchaseButton.buttonComponent.onClick = null
        }
      })
    }
  }

  // TODO: don't build full upgrade text if spell if at 0 level
  // should just be "next level: dmg: 10" not "next lvl: dmg 10 -> x"
  showSkillInfo(skill: string, type: string, displayName: string = null) {
    let el = null
    let text = ""
    let upgradeText = ""

    if ( type === 'spell' ) {
      displayName = skill.toUpperCase()
      el = this.spellLibrary.spells[skill]
      text = "Level: "+ el.level

      // add a new line since spells have multiple attributes to upgrade
      upgradeText += "\n"

      // build upgrade text
      let stats = el.stats()
      Object.keys(stats['current']).forEach(function(key) {
        if ( stats['next'][key] != 0 && key != 'level' && key != 'range' ) {
          // ex: "knockback: 1 -> 2\n"
          upgradeText += key +": "+ stats['current'][key] +" -> "+ stats['next'][key] +"\n"
        }
      })
    } else {
      el = this.player.stats[skill]
      text = "Current value: "+ el

      upgradeText = (el + this.player.statIncrementMap[skill]).toString()
    }

    // every upgradeText should have the same number of new lines
    // otherwise the alignment is off
    const requiredNewlines = 6 - upgradeText.split(/\r\n|\r|\n/).length
    upgradeText += Array(requiredNewlines).join("\n")

    // NOTE: this is nicer but due to heroku i can only use TS native code
    // upgradeText += "\n".repeat(5 - upgradeText.split(/\r\n|\r|\n/).length)

    this.skillInfoText.value = displayName +"\n"+ text +"\n\nNext level:"+ upgradeText
    this.skillInfoDescription.value = this.descriptionMap[skill]
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
    'poison': [125,0],
    'fireball': [250,0],
    'storm': [375,0],
    'maxMana': [0,80],
    'maxHp': [125,80],
    'dmg': [250,80],
    'range': [375,80]
  }

  constructor(parent: UIContainerRect, imageMap: Texture, skill: string) {
    super(parent, imageMap)

    let source = this.skillImgMap[skill]
    this.sourceLeft = source[0]
    this.sourceTop = source[1]
  }
}
