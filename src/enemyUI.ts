export class EnemyUI {
  HEALTH_BAR_MAX_WIDTH = 666

  enemy: any
  healthBar: UIContainerRect
  label: Entity
  text: TextShape

  defaultOffset = new Transform({
    position: new Vector3(0, 8, 0)
  })

  // TODO: use createLabel instead of constructor
  constructor(enemy: IEntity, offset?: Transform) {
    this.label = new Entity()
    this.label.setParent(enemy)
    this.label.addComponent(new Billboard())
    this.label.addComponent(offset || this.defaultOffset)

    this.text = new TextShape("")
    this.text.fontSize = 6
    this.text.color = Color3.White()

    this.label.addComponent(this.text)

    engine.addEntity(this.label)
  }

  createHealthBar(canvas: UICanvas) {
    const healthBarBg = new UIContainerRect(canvas)
    healthBarBg.width = this.HEALTH_BAR_MAX_WIDTH
    healthBarBg.height = 40
    healthBarBg.vAlign = 'top'
    healthBarBg.hAlign = 'left'
    healthBarBg.positionX = '27.5%'
    healthBarBg.positionY = 60
    healthBarBg.color = Color4.Black()
    healthBarBg.isPointerBlocker = false
    healthBarBg.visible = true

    this.healthBar = new UIContainerRect(canvas)
    this.healthBar.width = this.HEALTH_BAR_MAX_WIDTH
    this.healthBar.height = 40
    this.healthBar.vAlign = 'top'
    this.healthBar.hAlign = 'left'
    this.healthBar.positionX = '27.5%'
    this.healthBar.positionY = 60
    this.healthBar.color = Color4.Red()
    this.healthBar.isPointerBlocker = false
    this.healthBar.visible = true
  }

  updateLabel(text: string) {
    this.text.value = text
  }

  updateHealthBar(hp: number, maxHp: number) {
    this.healthBar.width = (hp / maxHp) * this.HEALTH_BAR_MAX_WIDTH
  }
}
