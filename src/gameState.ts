export class GameState {
  isStarted: boolean = false
  wave: number = 0
  waveIsActive: boolean = false

  startGame() {
    this.isStarted = true
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
