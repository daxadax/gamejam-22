export class Button extends UIImage {
  width: number = 169
  height: number = 45
  sourceWidth:number = 338
  sourceHeight: number = 91
  isPointerBlocker: boolean = true
  positionY: number = -180

  text: UIText

  constructor(canvas: UICanvas, buttonText: string = 'continue') {

    super(canvas, new Texture("assets/button_stone.png"))

    this.text = new UIText(this)
    this.text.width = 130
    this.text.font = new Font(Fonts.SanFrancisco)
    this.text.fontSize = 24
    this.text.hAlign = "center"
    this.text.vAlign = "center"
    this.text.positionY = 10
    this.text.color = Color4.White()
    this.text.isPointerBlocker = false
    this.text.value = buttonText.toUpperCase()
  }
}
