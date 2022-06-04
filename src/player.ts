import { UserData } from "@decentraland/Identity"
import { getUserData } from "@decentraland/Identity"

import { MovementBind } from './movementBind'
import { Spell } from './spell'

export class Player {
  stats = {
    dmgBonus: 0,
    hp: 100,
    hpRegenRate: 0.5,
    mana: 125,
    manaRegenRate: 7,
    maxHp: 100,
    maxMana: 125,
    rangeBonus: 0
  }

  statIncrementMap = {
    dmgBonus: 5,
    maxHp: 20,
    maxMana: 20,
    rangeBonus: 5
  }

  data!: UserData
  activeSpell!: Spell
  movementBind: MovementBind
  skillPoints: number = 3

  async initialize() {
    log('initializing player')

    // initialize movementBind
    this.movementBind = new MovementBind()

    // start pullling basic character information from DCL
    const userData = await getUserData();
    this.data = userData as UserData;
  }

  isDead() {
    return this.stats.hp <= 0
  }

  setActiveSpell(spell: Spell) {
    this.activeSpell = spell
  }

  diminishHp(amount: number) {
    this.stats.hp -= amount
  }

  replenishHp(amount: number) {
    this.stats.hp += amount
  }

  diminishMana(amount: number) {
    this.stats.mana -= amount
  }

  replenishMana(amount: number) {
    this.stats.mana += amount
  }

  incrementStat(statName: string) {
    this.stats[statName] += this.statIncrementMap[statName]
  }

  restrictMovement() {
    this.movementBind.bind()
  }

  unrestrictMovement() {
    this.movementBind.loose()
  }

  decrementSkillPoints(amount: number) {
    this.skillPoints -= amount
    return this.skillPoints
  }

  incrementSkillPoints(amount: number) {
    this.skillPoints += amount
    return this.skillPoints
  }
}
