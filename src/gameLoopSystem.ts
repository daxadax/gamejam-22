import { GameState } from './gameState'
import { GameUI } from './gameUI'
import { Player } from './player'
import { SpawnHelper } from './spawnHelper'

export class GameLoopSystem implements ISystem {
  enemies = []
  gameUI: GameUI
  gameState: GameState
  player: Player
  soundLibrary: SoundLibrary
  spawnHelper: SpawnHelper

  constructor(gameUI, gameState, player, soundLibrary, spawnHelper) {
    this.gameUI = gameUI
    this.gameState = gameState
    this.player = player
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
      // removing this line allows the player to keep casting spells
      // and triggering this function (since the spell entity is removed)
      // thereby getting unlimited skill points
      this.gameState.setWaveInactive()

      // notify player that wave is complete
      // this.gameUI.xxx

      // assign skill points
      this.player.incrementSkillPoints(3)

      // increment wave
      this.gameState.incrementWave()

      // play wave complete sound
      this.soundLibrary.play('wave_complete')

      // open skill menu
      // pass spawnhelper to start next wave with increased enemy difficulty / more enemies
      this.gameUI.selectNewSkills(this.spawnHelper)
    }
  }
}
