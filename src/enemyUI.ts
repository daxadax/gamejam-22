export class EnemyUI {
  label: Entity
  text: TextShape

  defaultOffset = new Transform({
    position: new Vector3(0, 8, 0)
  })

  constructor(enemy: IEntity, offset?: Transform) {
    this.label = new Entity(enemy.entityId +'-label')
    this.label.setParent(enemy)
    this.label.addComponent(new Billboard())
    this.label.addComponent(offset || this.defaultOffset)

    this.text = new TextShape("")
    this.text.fontSize = 6
    this.text.color = Color3.White()

    this.label.addComponent(this.text)

    engine.addEntity(this.label)
  }

  updateLabel(text: string) {
    this.text.value = text
  }
}
