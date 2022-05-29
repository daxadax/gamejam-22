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
    // TODO: this doesn't load
    // new StaticModel(new GLTFShape('models/mountain.glb'), 'mountain', this, new Transform({
    //   position: new Vector3(31.663864135742188, 0, 27.064531326293945),
    //   rotation: new Quaternion(0, 0, 0, 1),
    //   scale: new Vector3(255.9510955810547, 181.6527862548828, 194.45120239257812)
    // }))

    new StaticModel(new GLTFShape('models/mausoleum.glb'), 'mausoleum', this, new Transform({
      position: new Vector3(32, 0.05275225639343262, 32),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1)
    }))

    new StaticModel(new GLTFShape('models/altar-portal.glb'), 'altar', this, new Transform({
      position: new Vector3(32, 0.06, 31),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1)
    }))

    new StaticModel(new GLTFShape('models/entry.glb'), 'entryway', this, new Transform({
      position: new Vector3(32, 0.06, 31.5),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1)
    }))

    new StaticModel(new GLTFShape('models/sigil.glb'), 'sigil', this, new Transform({
      position: new Vector3(32, 5.14898681640625, 35.9151611328125),
      rotation: new Quaternion(-0.13971063494682312, -0.00955082569271326, -0.0013476144522428513, 0.9901455044746399),
      scale: new Vector3(1, 1, 1)
    }))

    new StaticModel(new GLTFShape('models/tombs.glb'), 'tombs', this, new Transform({
      position: new Vector3(32, 0, 32),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1)
    }))

    // models placed multiple times
    const yellowPineTree = new GLTFShape('models/pine_tree/model.glb')

    // place models
    new StaticModel(yellowPineTree, 'pinetree_001', this, new Transform({
      position: new Vector3(8, 0, 57.5),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(2.030536651611328, 2.030536651611328, 2.030536651611328)
    }))

    new StaticModel(yellowPineTree, 'pinetree_002', this, new Transform({
      position: new Vector3(17.000001907348633, 0, 60.5),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(2.030536651611328, 2.030536651611328, 2.030536651611328)
    }))

    new StaticModel(yellowPineTree, 'pinetree_003', this, new Transform({
      position: new Vector3(49.500003814697266, 0, 60.5),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(2.030536651611328, 2.030536651611328, 2.030536651611328)
    }))

    new StaticModel(yellowPineTree, 'pinetree_004', this, new Transform({
      position: new Vector3(4, 0, 33),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(2.030536651611328, 2.030536651611328, 2.030536651611328)
    }))

    new StaticModel(yellowPineTree, 'pinetree_005', this, new Transform({
      position: new Vector3(54.199581146240234, 0, 44),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(2.030536651611328, 2.030536651611328, 2.030536651611328)
    }))

    new StaticModel(yellowPineTree, 'pinetree_006', this, new Transform({
      position: new Vector3(59.72780227661133, 0, 49.17171859741211),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(2.030536651611328, 2.030536651611328, 2.030536651611328)
    }))

    new StaticModel(yellowPineTree, 'pinetree_007', this, new Transform({
      position: new Vector3(3.5, 0, 42.70071029663086),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(2.030536651611328, 2.030536651611328, 2.030536651611328)
    }))
  }
}
