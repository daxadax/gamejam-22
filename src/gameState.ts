export class GameState {
  isStarted: boolean = false
  wave: number = 0

  startGame() {
    this.isStarted = true
  }

  incrementWave() {
    this.wave += 1
  }
}
