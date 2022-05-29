import { Scene } from './scene'
import { SoundLibrary } from './soundLibrary'
import { Spawner } from './spawner'
import { spawnLocations } from './spawnLocations'


export class SpawnHelper {
  scene: Scene
  soundLibrary: SoundLibrary

  constructor(scene, soundLibrary) {
    this.scene = scene
    this.soundLibrary = soundLibrary
  }

  createSpawners(count: number) {
    const locations = spawnLocations.sort(() => .5 - Math.random()).slice(0, count);
    const self = this

    locations.forEach(function(spawnLocation, i) {
      const spawner = new Spawner(
        'spawner-'+ i,
        self.scene,
        self.soundLibrary,
        spawnLocation
      )

      spawner.initialize()
    })
  }
}
