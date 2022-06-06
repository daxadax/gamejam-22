import { GameManager } from './gameManager'
import { GameState } from './gameState'

export class GameLoopSystem implements ISystem {
  ephemeralEntities = []
  enemies = []
  gameManager: GameManager
  gameState: GameState

  constructor(gameManager, gameState) {
    this.gameManager = gameManager
    this.gameState = gameState
  }

  onAddEntity(entity: Entity) {
    // add entities created after system initialization to list of ephemeral entities
    this.ephemeralEntities.push(entity)

    if ( /enemy/.test(entity.name) ) {
      // set the wave as active on first enemy spawn per wave
      if ( !this.gameState.waveIsActive ) { this.gameState.setWaveActive() }

      // add enemy to list of enemies
      this.enemies.push(entity)
    }
  }

  onRemoveEntity(entity: Entity) {
    // remove enemy entities from enemies list
    if ( /enemy/.test(entity.name) ) {
      this.enemies.splice(this.enemies.indexOf(entity), 1)
    }

    if ( this.gameState.gameplayIsActive() && this.enemies.length === 0 ) {
      this.gameManager.completeWave()
    }
  }
}
