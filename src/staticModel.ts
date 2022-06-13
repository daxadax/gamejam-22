import { Scene } from './scene'

export class StaticModel extends Entity {
  constructor(
    name: string,
    model: GLTFShape,
    scene: Scene,
    transform: Transform
  ) {
    super(name)
    engine.addEntity(this)
    this.setParent(scene)
    this.addComponent(transform)

    model.withCollisions = true
    model.isPointerBlocker = true
    model.visible = true
    this.addComponent(model)

    return this
  }
}
