import { GameState } from './gameState'
import { GameUI } from './gameUI'
import { Player } from './player'
import { SpawnHelper } from './spawnHelper'

export class GameLoopSystem implements ISystem {
  enemies = []
  gameUI: GameUI
  gameState: GameState
  player: Player

  constructor(gameUI, gameState, player, spawnHelper) {
    this.gameUI = gameUI
    this.gameState = gameState
    this.player = player
    this.spawnHelper = spawnHelper
  }

  onAddEntity(entity: Entity) {
    if ( /enemy/.test(entity.name) ) {
      this.enemies.push(entity)
    }
  }

  onRemoveEntity(entity: Entity) {
    if ( /enemy/.test(entity.name) ) {
      this.enemies.splice(this.enemies.indexOf(entity), 1)
    }

    if ( this.gameState.isStarted && this.enemies.length === 0 ) {
      log('wave complete')

      // notify player that wave is complete
      // this.gameUI.xxx

      // assign skill points
      this.player.incrementSkillPoints(3)

      // increment wave
      this.gameState.incrementWave()

      // open skill menu
      this.gameUI.selectNewSkills(this.spawnHelper)

      // start next wave with increased enemy difficulty / more enemies
      // this.spawnHelper.startNextWave()
    }
  }
}
