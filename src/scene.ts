export class Scene extends Entity {
  constructor() {
    super('_scene')
    engine.addEntity(this)
    const basePosition = new Transform({
      position: new Vector3(0, 0, 0),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1)
    })
    this.addComponentOrReplace(basePosition)

  }

  addModifiers() {
    const modArea = new Entity()
    modArea.addComponent(
      new CameraModeArea({
        area: { box: new Vector3(64, 16, 64) },
        cameraMode: CameraMode.FirstPerson
      })
    )

    modArea.addComponent(
      new AvatarModifierArea({
        area: { box: new Vector3(64, 16, 64) },
        modifiers: [AvatarModifiers.HIDE_AVATARS]
      })
    )

    modArea.addComponent(
      new Transform({
        position: new Vector3(32, 1, 32),
        // scale: new Vector3(64, 3, 64)
      })
    )
    // modArea.addComponent(new BoxShape()).withCollisions = false
    engine.addEntity(modArea)
  }
}
