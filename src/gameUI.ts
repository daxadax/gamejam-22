import { Button } from './button'
import { Player } from './player'
import { PlayerUI } from './playerUI'
import { SkillUpgrades } from './skillUpgrades'
import { SoundLibrary } from './soundLibrary'
import { Spell } from './spell'

export class GameUI {
  canvas: UICanvas
  player: Player
  playerUI: PlayerUI
  skillUpgradesComponent: SkillUpgrades
  soundLibrary: SoundLibrary
  spellLibrary: Spell[]

  private gameStarted: Boolean = false
  private screenCover: UIContainerRect
  private text: UIText
  private textWrapper: UIImage

  introText =
    "After years of seeking, you've finally found it: the fabled tomb of the evil Archmage Bobby Bubonic. Your whole life has led you here and while you can't anticipate how things will end, you know it's your only chance to save your village / gain limitless power / get enough gold to pay for little timmy's operation. \n\nAre you ready?"
  introText2 =
    "Making it all the way here would have been impossible without some kind of magical training. What do you know? \n\nYou start the game with 3 skill points but you'll gain more as you play. Spend them wisely!\n\n\n" // each text container needs the same number of carraige returns for it to align properly. smh

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

    // player ui
    this.playerUI = new PlayerUI(canvas, player, spells)

    // skill upgrades component
    this.skillUpgradesComponent = new SkillUpgrades(canvas, player, soundLibrary, spells)
  }

  displayIntroduction() {
    this.screenCover.visible = true

    // intro text
    this.text.value = this.introText

    //// buttons
    const btn_next = new Button(this.canvas)
    btn_next.onClick = new OnClick(() => {
      // play sound
      this.soundLibrary.play('button_click')

      // hide existing components
      btn_next.visible = false

      this.displayIntroductionTwo()
    })
  }

  displayIntroductionTwo() {
    this.text.value = this.introText2

    // display skill select screen
    const btnSkillSelect = new Button(this.canvas)

    btnSkillSelect.onClick = new OnClick(() => {
      // play sound
      this.soundLibrary.play('button_click')

      // hide existing components
      btnSkillSelect.visible = false
      this.text.value = null

      this.selectSkills()
    })
  }

  selectSkills() {
    // skill upgrade component
    this.skillUpgradesComponent.container.positionY = 50
    this.skillUpgradesComponent.container.visible = false
    this.skillUpgradesComponent.show()

    // start game
    const btnStartGame = new Button(this.canvas)

    btnStartGame.onClick = new OnClick(() => {
      // TODO: if player has selected at least one spell, continue
      //       otherwise reset skillpoints and say "you must select at least one spell"

      this.gameStarted = true

      // play sound
      this.soundLibrary.play('button_click')

      // hide existing components
      this.screenCover.visible = false
      btnStartGame.visible = false
      this.skillUpgradesComponent.hide()

      // set active spell
      const spell = this.spellLibrary.find(spell => spell.level > 0)
      this.player.setActiveSpell(spell)
      this.playerUI.setActiveSpell(spell) // TODO: maybe "refresh ui"?

      // display playerUI
      this.playerUI.show()

      // allow player to move
      this.player.unrestrictMovement()
    })
  }

  toggleSkillUpgradeDisplay() {
    // don't allow this to be triggered before the game starts
    if ( this.gameStarted === false ) { return null }

    if ( this.skillUpgradesComponent.visible() ) {
      // hide UI elements
      this.screenCover.visible = false
      this.skillUpgradesComponent.hide()

      // show playerUI
      this.playerUI.show()
    } else {
      // hide playerUI
      this.playerUI.hide()

      // show UI elements
      this.screenCover.visible = true
      this.skillUpgradesComponent.show()
    }
  }
}
