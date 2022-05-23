export class MovementBind extends Entity {
  constructor() {
    super()

    const box = new BoxShape()
    box.withCollisions = true
    box.visible = false
    this.addComponent(box)
    this.addComponent(
      new Transform({
        position: Camera.instance.position,
        scale: new Vector3(1.5, 1.5, 1.5)
      })
    )
  }

  bind() {
    engine.addEntity(this)
  }

  loose() {
    engine.removeEntity(this)
  }
}
