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

  constructor(player) {
    this.canvas = new UICanvas()
    this.player = player
    this.soundLibrary = new SoundLibrary()
    this.spellLibrary = new SpellLibrary(this.soundLibrary)
    this.gameUI = new GameUI(this.canvas, player, this.soundLibrary, this.spellLibrary)
    this.scene = new Scene()
    this.gameState = new GameState()
  }

  // show basic UI and give player choice to play or quit
  initialize() {
    // start background music
    this.soundLibrary.loop('dark_ambience_loop')

    // build scene
    this.scene.initialize()
    this.scene.buildStaticModels()

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
    const gm = this

    // passing just the GM to each class is a little bit suspect
    // but it's so much easier. what could possibly go wrong?
    gm.camera               = Camera.instance
    gm.statusEffectResolver = new StatusEffectResolver()
    gm.playerHelper         = new PlayerActionHelper(gm)
    gm.spawnHelper          = new SpawnHelper(gm)
    gm.spellHelper          = new SpellHelper(gm)
    gm.gameIntro            = new GameIntroduction(gm)

    // systems
    gm.enemyActionSystem = new EnemyActionSystem(gm.camera, gm.playerHelper)
    gm.gameLoopSystem = new GameLoopSystem(gm, gm.gameState)

    // add systems
    engine.addSystem(gm.enemyActionSystem)
    engine.addSystem(gm.gameLoopSystem)

    // start game loop
    gm.gameIntro.initialize()
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
