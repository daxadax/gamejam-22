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
    // spells
    // TODO: better spell 3d models
    // Blizzard: Ice damage [ slow enemy ]
    // Poison: Earth damage [ poison enemy ]
    // Fireball: Fire damage [ DMG+ ]
    // Storm: Air damage [ knockback enemy ]
    const blizzard = new Spell('blizzard', 'iceball.gltf', soundLibrary, {'slow': 1})
    const poison   = new Spell('poison', 'poison.gltf', soundLibrary, {'dot': 0.5})
    const fireball = new Spell('fireball', 'fireball.gltf', soundLibrary, {'dmg': 2.5})
    const storm    = new Spell('storm', 'trashy.gltf', soundLibrary, {'knockback': 1})

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

  getUIImage(name: string) {
    return this.UIImageMap[name]
  }
}
