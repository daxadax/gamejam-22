export class Button {
  buttonComponent: UIImage

  private disabledTexture: Texture
  private enabledTexture: Texture
  private text: UIText

  constructor(canvas: UICanvas, buttonText: string = 'continue') {
    this.enabledTexture = new Texture("assets/button_stone.png")
    this.disabledTexture = new Texture("assets/button_stone_disabled.png")

    this.buttonComponent = new UIImage(canvas, this.enabledTexture)
    this.buttonComponent.width = 169
    this.buttonComponent.height = 45
    this.buttonComponent.sourceWidth = 338
    this.buttonComponent.sourceHeight = 91
    this.buttonComponent.isPointerBlocker = true
    this.buttonComponent.positionY = -180

    this.text = new UIText(this.buttonComponent)
    this.text.width = 130
    this.text.font = new Font(Fonts.SanFrancisco)
    this.text.fontSize = 24
    this.text.hAlign = "center"
    this.text.vAlign = "center"
    this.text.positionY = 10
    this.text.color = Color4.White()
    this.text.isPointerBlocker = false
    this.text.value = buttonText.toUpperCase()

    return this
  }

  show() {
    this.buttonComponent.visible = true
  }

  hide() {
    this.buttonComponent.visible = false
  }

  setPosition(x: number, y: number) {
    this.buttonComponent.positionX = 375
    this.buttonComponent.positionY = -140
  }

  disable() {
    this.buttonComponent.source = this.disabledTexture
    this.text.color = Color4.Gray()
  }

  enable() {
    this.buttonComponent.source = this.enabledTexture
    this.text.color = Color4.White()
  }
}
