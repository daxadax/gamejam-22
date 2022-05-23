import * as utils from '@dcl/ecs-scene-utils'

import { Player } from './player'
import { GameUI } from './gameUI'

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

  diminishHp(amount: number) {
    this.player.diminishHp(amount)
    this.gameUI.playerUI.decrementHp(amount)
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
}
