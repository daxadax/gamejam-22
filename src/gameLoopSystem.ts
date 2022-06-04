import { GameState } from './gameState'
import { GameUI } from './gameUI'
import { PlayerActionHelper } from './playerActionHelper'
import { SoundLibrary } from './soundLibrary'
import { SpawnHelper } from './spawnHelper'

export class GameLoopSystem implements ISystem {
  enemies = []
  gameUI: GameUI
  gameState: GameState
  playerHelper: PlayerActionHelper
  soundLibrary: SoundLibrary
  spawnHelper: SpawnHelper

  constructor(gameUI, gameState, playerHelper, soundLibrary, spawnHelper) {
    this.gameUI = gameUI
    this.gameState = gameState
    this.playerHelper = playerHelper
    this.soundLibrary = soundLibrary
    this.spawnHelper = spawnHelper
  }

  onAddEntity(entity: Entity) {
    if ( /enemy/.test(entity.name) ) {
      // set the wave as active on first enemy spawn per wave
      if ( !this.gameState.waveIsActive ) { this.gameState.setWaveActive() }

      // add enemy to list of enemies
      this.enemies.push(entity)
    }
  }

  onRemoveEntity(entity: Entity) {
    if ( /enemy/.test(entity.name) ) {
      this.enemies.splice(this.enemies.indexOf(entity), 1)
    }

    if ( this.gameState.isStarted && this.gameState.waveIsActive && this.enemies.length === 0 ) {
      log('wave complete')

      // mark the wave as currently inactive
      // WARNING: removing this line causes widespread chaos
      this.gameState.setWaveInactive()

      // pause player regeneration between waves
      this.playerHelper.stopRegeneration()

      // notify player that wave is complete
      // this.gameUI.xxx

      // assign skill points
      this.playerHelper.incrementSkillPoints(3)

      // increment wave
      this.gameState.incrementWave()

      // play wave complete sound
      this.soundLibrary.play('wave_complete')

      // open skill menu
      // pass spawnhelper to start next wave with increased enemy difficulty / more enemies
      this.gameUI.selectNewSkills(this.spawnHelper, this.playerHelper)
    }
  }
}
