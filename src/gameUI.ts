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
  screenCover: UIContainerRect
  skillUpgradesComponent: SkillUpgrades
  soundLibrary: SoundLibrary
  spellLibrary: Spell[]
  text: UIText

  introText =
    "After years of seeking, you've finally found it: the fabled tomb of the evil Archmage Bobby Bubonic. Your whole life has led you here and while you can't anticipate how things will end, you know it's your only chance to save your village / gain limitless power / get enough gold to pay for little timmy's operation. \n\nAre you ready?"
  characterCreationText =
    "Making it all the way here would have been impossible without some kind of magical training. \n\nWhat do you know?\n\n\n\n" // this is fucking stupid, but the text container needs have the same number of carraige returns for it to align properly. why are you like this?

  constructor(
    canvas: UICanvas,
    player: Player,
    soundLibrary: SoundLibrary,
    spells: Spell[]
  ) {
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

    // ui text component
    this.text = new UIText(this.screenCover)
    this.text.adaptWidth = false
    this.text.textWrapping = true
    this.text.width = "50%"
    this.text.font = new Font(Fonts.SanFrancisco)
    this.text.fontSize = 20
    this.text.hAlign = "center"
    this.text.vAlign = "top"
    this.text.positionY = -200
    this.text.color = Color4.White()

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
    const btn_goToCharacterCreation = new Button(this.canvas)
    btn_goToCharacterCreation.onClick = new OnClick(() => {
      // play sound
      this.soundLibrary.play('button_click')

      // hide existing components
      btn_goToCharacterCreation.visible = false

      this.createCharacter()
    })
  }

  createCharacter() {
    this.text.value = this.characterCreationText
    this.skillUpgradesComponent.container.visible = true

    // skill upgrade component
    this.skillUpgradesComponent.container.positionY = 50
    this.skillUpgradesComponent.container.visible = false
    this.skillUpgradesComponent.show()

    // start game
    const btnStartGame = new Button(this.canvas)
    btnStartGame.positionY = -200

    btnStartGame.onClick = new OnClick(() => {
      // TODO: if player has selected at least one spell, continue
      //       otherwise reset skillpoints and say "you must select at least one spell"

      // play sound
      this.soundLibrary.play('button_click')

      // hide existing components
      this.screenCover.visible = false
      btnStartGame.visible = false
      this.skillUpgradesComponent.container.visible = false

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
}
