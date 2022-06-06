export class SoundLibrary {
  library: any

  constructor() {
    const blizzardSpell = new Sound('blizzard.wav')
    const buttonClick = new Sound('upgrade_select.mp3')
    const enemyDie = new Sound('enemy_death.mp3')
    const enemyHit = new Sound('hit.wav')
    const fireballSpell = new Sound('fireball.wav')
    const playerHit = new Sound('player_hit.mp3')
    const portalClose = new Sound('portal_close.wav')
    const stormSpell = new Sound('lightning.wav')
    const upgradeSkill = new Sound('downgrade_select.mp3')
    const poisonSpell = new Sound('poison.wav')
    const waveComplete = new Sound('magic_spell_06.wav')

    const darkAmbienceLoop = new BackgroundSound('dark_ambience_loop.mp3')

    this.library =  {
      button_click: buttonClick,
      enemy_die: enemyDie,
      enemy_hit: enemyHit,
      player_hit: playerHit,
      portal_close: portalClose,
      dark_ambience_loop: darkAmbienceLoop,
      spell_blizzard: blizzardSpell,
      spell_fireball: fireballSpell,
      spell_storm: stormSpell,
      spell_poison: poisonSpell,
      upgrade_skill: upgradeSkill,
      wave_complete: waveComplete
    }
  }

  play(name: string) {
    this.library[name].getComponent(AudioSource).playOnce()
  }

  loop(name: string) {
    this.library[name].getComponent(AudioSource).playing = true
  }
}

class Sound extends Entity {
  constructor(assetPath: string) {
    super()

    this.addComponent(new Transform())
    engine.addEntity(this)

    this.setParent(Attachable.AVATAR)
    this.addComponent(
      new AudioSource(new AudioClip('sounds/'+ assetPath))
    )
  }
}

class BackgroundSound extends Entity {
  constructor(assetPath: string) {
    super()

    this.addComponent(new Transform())
    engine.addEntity(this)

    const source = new AudioSource(new AudioClip('sounds/'+ assetPath))
    source.loop = true
    source.volume = 0.5

    this.setParent(Attachable.AVATAR)
    this.addComponent(source)
  }
}
