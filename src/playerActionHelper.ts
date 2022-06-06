import * as utils from '@dcl/ecs-scene-utils'

import { GameManager } from './gameManager'
import { GameUI } from './gameUI'
import { Player } from './player'
import { SoundLibrary } from './soundLibrary'
import { Spell } from './spell'

export class PlayerActionHelper {
  gameManager: GameManager
  gameUI: GameUI
  player: Player
  regenerator: Entity
  soundLibrary: SoundLibrary

  constructor(gameManager, gameUI, player, soundLibrary) {
    this.gameManager  = gameManager
    this.gameUI       = gameUI
    this.player       = player
    this.soundLibrary = soundLibrary

    this.regenerator = new Entity()
    this.regenerator.addComponent(
      new utils.Interval(500, () => {
        let manaRegen = this.player.stats.manaRegenRate
        let hpRegen = this.player.stats.hpRegenRate

        this.replenishMana(manaRegen)
        this.replenishHp(hpRegen)
      })
    )
  }

  startRegeneration() {
    engine.addEntity(this.regenerator)
  }

  stopRegeneration() {
    engine.removeEntity(this.regenerator)
  }

  setActiveSpell(spell: Spell) {
    this.player.setActiveSpell(spell)
    this.gameUI.playerUI.setActiveSpell(spell.name, spell.level)
  }

  activeSpellStats() {
    const spell = this.player.activeSpell

    // probably there is a much cleaner way to do this but idk js hing
    return {
      dmg: spell.dmg + this.player.stats.dmgBonus,
      dot: spell.dot,
      knockback: spell.knockback,
      range: spell.range + this.player.stats.rangeBonus,
      slow: spell.slow
    }
  }

  takeDmg(amount: number) {
    log('player took '+ amount +' damage')

    // TODO: this color flash could be tighter with the attack animation
    this.gameUI.flashColor(new Color4(255, 0, 0, 0.25))
    this.soundLibrary.play('player_hit')
    this.player.diminishHp(amount)
    this.gameUI.playerUI.decrementHp(amount)

    if ( this.player.isDead() ) {
      this.gameManager.endGame()
    }
  }

  replenishHp(amount: number) {
    if ( this.player.stats.hp < this.player.stats.maxHp) {
      this.player.replenishHp(amount)
      this.gameUI.playerUI.incrementHp(amount)
    }
  }

  diminishMana(amount: number) {
    if ( this.player.stats.mana > 0) {
      this.player.diminishMana(amount)
      this.gameUI.playerUI.decrementMana(amount)
    }
  }

  replenishMana(amount: number) {
    if ( this.player.stats.mana < this.player.stats.maxMana) {
      this.player.replenishMana(amount)
      this.gameUI.playerUI.incrementMana(amount)
    }
  }

  incrementSkillPoints(amount: number) {
    return this.player.incrementSkillPoints(amount)
  }

  restrictMovement() {
    this.player.restrictMovement()
  }

  unrestrictMovement() {
    this.player.unrestrictMovement()
  }
}
