import * as utils from '@dcl/ecs-scene-utils'

import { BossEnemy } from './bossEnemy'
import { GameManager } from './gameManager'
import { GameState } from './gameState'
import { GameUI } from './gameUI'
import { Scene } from './scene'
import { SoundLibrary } from './soundLibrary'
import { Spawner } from './spawner'
import { StaticModel } from './staticModel'
import { StatusEffectResolver } from './statusEffectResolver'
import { spawnLocations } from './spawnLocations'

export class SpawnHelper {
  gameManager: GameManager
  gameState: GameState
  gameUI: GameUI
  scene: Scene
  soundLibrary: SoundLibrary
  statusEffectResolver: StatusEffectResolver

  constructor(gameManager) {
    this.gameManager          = gameManager
    this.gameState            = gameManager.gameState
    this.gameUI               = gameManager.gameUI
    this.scene                = gameManager.scene
    this.soundLibrary         = gameManager.soundLibrary
    this.statusEffectResolver = gameManager.statusEffectResolver
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
      this.spawnBoss()

      // create spawners every 20 seconds
      new utils.Interval(20000, () => {
        this.createSpawners(3, 2, 'skelly')
      })
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

  spawnBoss() {
    // animate tomb coming up from the ground with sound effect
    let startPosition = new Vector3(32.5, -10, 10)
    let endPosition = new Vector3(32.5, -3, 10)

    // create tomb
    const tomb = new StaticModel(new GLTFShape('models/altar-portal.glb'), 'altar', this.scene, new Transform({
      position: startPosition,
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1)
    }))
    tomb.addComponent(new utils.MoveTransformComponent(startPosition, endPosition, 7.5))

    // play boss entrance sound
    this.soundLibrary.play('boss_emerge')

    // TODO: spawn in some smoke so the "pop in" effect is not so jarring
    // spawn boss with 10 second delay (fits audio)
    new BossEnemy(
      new GLTFShape('models/boss.glb'), // TODO: model library like soundLibrary
      'enemy-boss',
      this.gameManager,
      new Transform({
        position: new Vector3(32, 0, 32),
        rotation: Quaternion.Euler(0, 180, 0),
        scale: new Vector3(1, 1, 1)
      }),
      10000
    )
  }
}
