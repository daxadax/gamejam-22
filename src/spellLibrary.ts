import { SoundLibrary } from './soundLibrary'
import { Spell } from './spell'

export class SpellLibrary {
  spells: any
  soundLibrary: SoundLibrary

  UIImageMap = {
    'blizzard': 0,
    'poison': 50,
    'fireball': 100,
    'storm': 150
  }

  constructor(soundLibrary) {
    this.soundLibrary = soundLibrary
    this.initialize()
  }

  initialize() {
    // spells
    // Blizzard: Ice damage [ slow enemy ]
    // Poison: Earth damage [ poison enemy ]
    // Fireball: Fire damage [ DMG+ ]
    // Storm: Air damage [ knockback enemy ]
    const blizzard = new Spell('blizzard', 'blizzard.glb', this.soundLibrary, {'slow': 1})
    const poison   = new Spell('poison', 'poison.glb', this.soundLibrary, {'dot': 0.5})
    const fireball = new Spell('fireball', 'fireball.glb', this.soundLibrary, {'dmg': 2.5})
    const storm    = new Spell('storm', 'storm.glb', this.soundLibrary, {'knockback': 1})

    this.spells =  {
      blizzard: blizzard,
      poison: poison,
      fireball: fireball,
      storm: storm
    }
  }

  // TODO: make a cache here or on player instead everytime a spell is learned
  // TODO: of course Object.values doesn't work, why is typeshit so lame
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

  getUIImage(name: string) {
    return this.UIImageMap[name]
  }
}
