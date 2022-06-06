import { GameIntroduction } from './gameIntroduction'
import { GameState } from './gameState'
import { GameUI } from './gameUI'
import { Player } from './player'
import { Scene } from './scene'
import { SoundLibrary } from './soundLibrary'
import { SpellLibrary } from './spellLibrary'

import { PlayerActionHelper } from './playerActionHelper'
import { SpawnHelper } from './spawnHelper'
import { SpellHelper } from './spellHelper'
import { StatusEffectResolver } from './statusEffectResolver'

import { EnemyActionSystem } from './enemyActionSystem'
import { GameLoopSystem } from './gameLoopSystem'

export class GameManager {
  canvas: UICanvas
  gameUI: GameUI
  player: Player
  soundLibrary: SoundLibrary
  spellLibrary: SpellLibrary

  // helpers
  camera!: Camera
  gameIntro!: GameIntroduction
  gameState!: GameState
  playerHelper!: PlayerActionHelper
  scene!: Scene
  spawnHelper!: SpawnHelper
  spellHelper!: SpellHelper
  statusEffectResolver!: StatusEffectResolver

  // systems
  enemyActionSystem!: EnemyActionSystem
  gameLoopSystem!: GameLoopSystem

  constructor(canvas, gameUI, player, soundLibrary, spellLibrary) {
    this.canvas = canvas
    this.gameUI = gameUI
    this.player = player
    this.soundLibrary = soundLibrary
    this.spellLibrary = spellLibrary
  }

  // show basic UI and give player choice to play or quit
  initialize() {
    // initialize player and restrict movement
    this.player.initialize()
    this.player.restrictMovement()

    this.gameUI.btnNext.buttonComponent.onClick = new OnClick(() => {
      // play sound
      this.soundLibrary.play('button_click')

      // load resources and enter game loop
      this.startGame()
    })

    this.gameUI.displayPlayerChoice()
  }

  // load models, entities and systems and enter game loop
  startGame() {
    this.camera = Camera.instance
    this.gameState = new GameState()
    this.scene = new Scene()
    this.statusEffectResolver = new StatusEffectResolver()
    this.playerHelper = new PlayerActionHelper(this, this.gameUI, this.player, this.soundLibrary)
    this.spawnHelper = new SpawnHelper(this.gameState, this.scene, this.soundLibrary, this.statusEffectResolver)
    this.spellHelper = new SpellHelper(this.camera, this.playerHelper, this.spellLibrary)

    this.gameIntro = new GameIntroduction(
      this.gameUI,
      this.gameState,
      this.playerHelper,
      this.soundLibrary,
      this.spawnHelper
    )

    // systems
    this.enemyActionSystem = new EnemyActionSystem(this.camera, this.playerHelper)
    this.gameLoopSystem = new GameLoopSystem(this, this.gameState)

    // add systems
    engine.addSystem(this.enemyActionSystem)
    engine.addSystem(this.gameLoopSystem)

    // TODO: if certain scene components should be kept, they should be loaded
    // before the systems are added to the engine
    // run initializers
    this.scene.initialize()
    this.scene.buildStaticModels()

    // start game loop
    this.gameIntro.initialize()
  }

  // remove models, entities and systems and re-initialize
  endGame() {
    if ( this.gameState.isOver ) { return null }

    let entitiesToRemove = this.gameLoopSystem.ephemeralEntities

    // remove systems
    engine.removeSystem(this.enemyActionSystem)
    engine.removeSystem(this.gameLoopSystem)

    // officially end the game
    this.gameState.endGame()

    // remove all enemies
    entitiesToRemove.forEach(function(entity) {
      engine.removeEntity(entity)
    })

    // handle player state
    this.playerHelper.stopRegeneration()
    this.player.restrictMovement()

    // configure 'try again' button actions
    this.gameUI.btnNext.buttonComponent.onClick = new OnClick(() => {
      // play sound
      this.soundLibrary.play('button_click')

      // reset player
      this.player.reset()

      // reset spells
      this.spellLibrary.reset()

      // move player to spawn point

      // re-start game
      this.startGame()
    })

    // display game over message
    this.gameUI.displayGameOver()
  }

  completeWave() {
    log('wave complete')

    // mark the wave as currently inactive
    // WARNING: removing this line causes widespread chaos
    this.gameState.setWaveInactive()

    // pause player regeneration between waves
    this.playerHelper.stopRegeneration()

    // TODO: notify player that wave is complete
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
