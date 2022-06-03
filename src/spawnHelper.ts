import { GameState } from './gameState'
import { Scene } from './scene'
import { SoundLibrary } from './soundLibrary'
import { Spawner } from './spawner'
import { spawnLocations } from './spawnLocations'
import { StatusEffectResolver } from './statusEffectResolver'

export class SpawnHelper {
  gameState: GameState
  scene: Scene
  soundLibrary: SoundLibrary
  statusEffectResolver: StatusEffectResolver

  constructor(gameState, scene, soundLibrary, statusEffectResolver) {
    this.gameState = gameState
    this.scene = scene
    this.soundLibrary = soundLibrary
    this.statusEffectResolver = statusEffectResolver
  }

  // TODO: increase difficulty per wave
  // enemy/spawner health
  // new enemies
  // more dmg
  // more speed
  // etc
  startNextWave() {
    log('starting wave '+ this.gameState.wave)
    this.createSpawners(this.gameState.wave)
  }

  createSpawners(count: number) {
    const locations = spawnLocations.sort(() => .5 - Math.random()).slice(0, count);
    const self = this

    locations.forEach(function(spawnLocation, i) {
      const spawner = new Spawner(
        'enemy-spawner-'+ i,
        self.scene,
        self.soundLibrary,
        self.statusEffectResolver,
        spawnLocation
      )

      spawner.initialize()
    })
  }
}
