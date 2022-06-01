import { GameState } from './gameState'
import { Scene } from './scene'
import { SoundLibrary } from './soundLibrary'
import { Spawner } from './spawner'
import { spawnLocations } from './spawnLocations'


export class SpawnHelper {
  gameState: GameState
  scene: Scene
  soundLibrary: SoundLibrary

  constructor(gameState, scene, soundLibrary) {
    this.gameState = gameState
    this.scene = scene
    this.soundLibrary = soundLibrary
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
        spawnLocation
      )

      spawner.initialize()
    })
  }
}
