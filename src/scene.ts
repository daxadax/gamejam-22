import * as utils from '@dcl/ecs-scene-utils'

import { StaticModel } from './staticModel'
import { Spell } from './spell'

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

    return this
  }

  initialize() {
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

  buildStaticModels() {
    new StaticModel(new GLTFShape('models/ground.glb'), 'ground', this, new Transform({
      position: new Vector3(30.75, 0, 28),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(0.999, 0.999, 0.999)
    }))

    // new StaticModel(new GLTFShape('models/altar-portal.glb'), 'altar', this, new Transform({
    //   position: new Vector3(32, 0.06, 31),
    //   rotation: new Quaternion(0, 0, 0, 1),
    //   scale: new Vector3(1, 1, 1)
    // }))

    // new StaticModel(new GLTFShape('models/entry.glb'), 'entryway', this, new Transform({
    //   position: new Vector3(32, 0.06, 31.5),
    //   rotation: new Quaternion(0, 0, 0, 1),
    //   scale: new Vector3(1, 1, 1)
    // }))

    // new StaticModel(new GLTFShape('models/sigil.glb'), 'sigil', this, new Transform({
    //   position: new Vector3(32, 5.14898681640625, 35.9151611328125),
    //   rotation: new Quaternion(-0.13971063494682312, -0.00955082569271326, -0.0013476144522428513, 0.9901455044746399),
    //   scale: new Vector3(1, 1, 1)
    // }))

    new StaticModel(new GLTFShape('models/tombs.glb'), 'tombs', this, new Transform({
      position: new Vector3(32, 0, 37),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1)
    }))

    // models placed multiple times
    // const yellowPineTree = new GLTFShape('models/pine_tree/model.glb')

    // place models
    // new StaticModel(yellowPineTree, 'pinetree_001', this, new Transform({
    //   position: new Vector3(8, 0, 57.5),
    //   rotation: new Quaternion(0, 0, 0, 1),
    //   scale: new Vector3(2.030536651611328, 2.030536651611328, 2.030536651611328)
    // }))
  }
}
