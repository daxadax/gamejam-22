import * as utils from '@dcl/ecs-scene-utils'

import { GameUI } from './gameUI'
import { Player } from './player'
import { Spell } from './spell'

export class PlayerActionHelper {
  player: Player
  gameUI: GameUI
  regenerator: Entity

  constructor(player: Player, gameUI: GameUI) {
    this.player = player
    this.gameUI = gameUI

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

  setActiveSpell(spell: Spell) {
    this.player.setActiveSpell(spell)
    this.gameUI.playerUI.setActiveSpell(spell)
  }

  activeSpellStats() {
    const spell = this.player.activeSpell

    // probably there is a much cleaner way to do this but idk js hing
    return {
      atkSpeed: spell.atkSpeed,
      dmg: spell.dmg + this.player.stats.dmgBonus,
      knockback: spell.knockback,
      range: spell.range + this.player.stats.rangeBonus,
      slow: spell.slow
    }
  }

  diminishHp(amount: number) {
    if ( this.player.stats.hp > 0) {
      this.player.diminishHp(amount)
      this.gameUI.playerUI.decrementHp(amount)
    } else {
      // TODO: you dead
      log('i am le dead')
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

  restrictMovement() {
    this.player.restrictMovement()
  }

  unrestrictMovement() {
    this.player.unrestrictMovement()
  }
}
