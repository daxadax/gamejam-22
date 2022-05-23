export class Button extends UIImage {
  width: number = 150
  height: number = 100
  sourceWidth:number = 300
  sourceHeight: number = 200
  isPointerBlocker: boolean = true

  constructor(canvas: UICanvas) {
    super(canvas, new Texture("assets/button.png"))
  }
}
