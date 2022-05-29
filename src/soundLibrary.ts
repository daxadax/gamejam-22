export class SoundLibrary {
  library: any

  constructor() {
    const buttonClick = new Sound('upgrade_select.mp3')
    const enemyDie = new Sound('enemy_death.mp3')
    const enemyHit = new Sound('hit.wav')
    const upgradeSkill = new Sound('downgrade_select.mp3')

    this.library =  {
      button_click: buttonClick,
      upgrade_skill: upgradeSkill,
      enemy_die: enemyDie,
      enemy_hit: enemyHit
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
