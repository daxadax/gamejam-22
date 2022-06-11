export class GameState {
  isOver: boolean = false
  isStarted: boolean = false
  wave: number = 0
  waveIsActive: boolean = false

  reset() {
    this.isOver = false
    this.isStarted = false
    this.wave = 0
    this.waveIsActive = false
  }

  startGame() {
    this.isStarted = true
  }

  endGame() {
    this.isOver = true
  }

  gameplayIsActive() {
    return this.isStarted && !this.isOver && this.waveIsActive
  }

  incrementWave() {
    this.wave += 1
  }

  setWaveActive() {
    this.waveIsActive = true
  }

  setWaveInactive() {
    this.waveIsActive = false
  }
}
