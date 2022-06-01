export class SoundLibrary {
  library: any

  constructor() {
    const blizzardSpell = new Sound('blizzard.wav')
    const buttonClick = new Sound('upgrade_select.mp3')
    const enemyDie = new Sound('enemy_death.mp3')
    const enemyHit = new Sound('hit.wav')
    const fireballSpell = new Sound('fireball.wav')
    const stormSpell = new Sound('lightning.wav')
    const portalClose = new Sound('portal_close.wav')
    const waveComplete = new Sound('magic_spell_06.wav')
    const upgradeSkill = new Sound('downgrade_select.mp3')
    const vinesSpell = new Sound('vines.wav')

    this.library =  {
      button_click: buttonClick,
      enemy_die: enemyDie,
      enemy_hit: enemyHit,
      portal_close: portalClose,
      spell_blizzard: blizzardSpell,
      spell_fireball: fireballSpell,
      spell_storm: stormSpell,
      spell_vines: vinesSpell,
      upgrade_skill: upgradeSkill,
      wave_complete: waveComplete
    }
  }

  play(name: string) {
    this.library[name].getComponent(AudioSource).playOnce()
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
