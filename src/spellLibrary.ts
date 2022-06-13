import { GameManager } from './gameManager'
import { SoundLibrary } from './soundLibrary'
import { Spell } from './spell'

export class SpellLibrary {
  gameManager: GameManager
  spells: any
  soundLibrary: SoundLibrary

  activeStatMap = {
    'blizzard': 'Slow',
    'poison': 'DoT',
    'storm': 'Knockback'
  }

  UIImageMap = {
    'blizzard': 0,
    'fireball': 100,
    'poison': 200,
    'storm': 300
  }

  constructor(gameManager) {
    this.gameManager = gameManager
    this.soundLibrary = gameManager.soundLibrary
    this.initialize()
  }

  initialize() {
    // spells
    // Blizzard: Ice damage [ slow enemy ]
    // Poison: Earth damage [ poison enemy ]
    // Fireball: Fire damage [ DMG+ ]
    // Storm: Air damage [ knockback enemy ]
    const blizzard = new Spell('blizzard', this.gameManager, {'slow': 1})
    const poison   = new Spell('poison', this.gameManager, {'dot': 0.5})
    const fireball = new Spell('fireball', this.gameManager, {'dmg': 2.5})
    const storm    = new Spell('storm', this.gameManager, {'knockback': 1})

    this.spells =  {
      blizzard: blizzard,
      poison: poison,
      fireball: fireball,
      storm: storm
    }
  }

  knownSpells() {
    //return this.spells.map(function(key) { this.spells[key] }).filter(spell => spell.level > 0)
    let knownSpells = []

    Object.keys(this.spells).forEach((name) => {
      if ( this.spells[name].level > 0 ) {
        knownSpells.push(this.spells[name])
      }
    })

    return knownSpells
  }

  reset() {
    this.spells = {}
    this.initialize()
  }

  getActiveStat(name: string) {
    return this.activeStatMap[name]
  }

  getUIImage(name: string) {
    return this.UIImageMap[name]
  }
}
