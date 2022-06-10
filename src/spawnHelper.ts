import { GameState } from './gameState'
import { GameUI } from './gameUI'
import { Scene } from './scene'
import { SoundLibrary } from './soundLibrary'
import { Spawner } from './spawner'
import { spawnLocations } from './spawnLocations'
import { StatusEffectResolver } from './statusEffectResolver'

export class SpawnHelper {
  gameState: GameState
  gameUI: GameUI
  scene: Scene
  soundLibrary: SoundLibrary
  statusEffectResolver: StatusEffectResolver

  constructor(gameState, gameUI, scene, soundLibrary, statusEffectResolver) {
    this.gameState = gameState
    this.gameUI = gameUI
    this.scene = scene
    this.soundLibrary = soundLibrary
    this.statusEffectResolver = statusEffectResolver
  }

  startNextWave() {
    const waveNumber = this.gameState.wave

    // notify player that next wave is starting
    this.gameUI.notify("Wave "+ waveNumber)

    if ( waveNumber < 3 ) {
      this.createSpawners(waveNumber, waveNumber, 'skelly')
      return null
    }

    if ( waveNumber < 5 ) {
      this.createSpawners(waveNumber, waveNumber, 'armored_skelly')
    }

    if ( waveNumber === 5 ) {
      // TODO: spawn boss

      // create spawners at interval
      this.createSpawners(waveNumber, waveNumber, 'skelly')
    }
  }

  createSpawners(level: number, count: number, enemyType: string) {
    // pull x spawn locations where x is the give count
    const locations = spawnLocations.sort(() => .5 - Math.random()).slice(0, count);
    const self = this

    locations.forEach(function(spawnLocation, i) {
      self.createSpawner(level, i, enemyType, spawnLocation)
    })
  }

  createSpawner(level: number, enemyNumber: number, enemyType: string, spawnLocation: Transform) {
     new Spawner(
      level,
      'enemy-spawner-'+ enemyNumber,
      enemyType,
      this.scene,
      this.soundLibrary,
      this.statusEffectResolver,
      spawnLocation
    ).initialize()
  }
}
