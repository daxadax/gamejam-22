export class EnemyUI {
  HEALTH_BAR_MAX_WIDTH = 666

  enemy: any
  healthBarBg: UIContainerRect
  healthBar: UIContainerRect
  label: Entity
  text: TextShape

  defaultOffset = new Transform({
    position: new Vector3(0, 8, 0)
  })

  constructor(enemy: IEntity) {
    this.enemy = enemy
  }

  createLabel(offset?: Transform) {
    this.label = new Entity()
    this.label.setParent(this.enemy)
    this.label.addComponent(new Billboard())
    this.label.addComponent(offset || this.defaultOffset)

    this.text = new TextShape("")
    this.text.fontSize = 6
    this.text.color = Color3.White()

    this.label.addComponent(this.text)

    engine.addEntity(this.label)
  }

  createHealthBar(canvas: UICanvas) {
    this.healthBarBg = new UIContainerRect(canvas)
    this.healthBarBg.width = this.HEALTH_BAR_MAX_WIDTH
    this.healthBarBg.height = 40
    this.healthBarBg.vAlign = 'top'
    this.healthBarBg.hAlign = 'left'
    this.healthBarBg.positionX = '27.5%'
    this.healthBarBg.positionY = 60
    this.healthBarBg.color = Color4.Black()
    this.healthBarBg.isPointerBlocker = false
    this.healthBarBg.visible = true

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

  removeHealthBar() {
    this.healthBarBg.visible = false
    this.healthBar.visible = false
  }

  updateLabel(text: string) {
    this.text.value = text
  }

  updateHealthBar(hp: number, maxHp: number) {
    this.healthBar.width = (hp / maxHp) * this.HEALTH_BAR_MAX_WIDTH
  }
}
