import * as utils from '@dcl/ecs-scene-utils'

import { GameManager } from './gameManager'
import { ModelLibrary } from './modelLibrary'
import { staticLocations } from './staticLocations'
import { StaticModel } from './staticModel'
import { Spell } from './spell'

export class Scene extends Entity {
  modelLibrary: ModelLibrary

  constructor(gameManager: GameManager) {
    super('_scene')
    engine.addEntity(this)
    const basePosition = new Transform({
      position: new Vector3(0, 0, 0),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(1, 1, 1)
    })
    this.addComponentOrReplace(basePosition)

    this.modelLibrary = gameManager.modelLibrary

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
    new StaticModel('ground', this.modelLibrary.ground, this, new Transform({
      position: new Vector3(30.75, 0, 28),
      rotation: new Quaternion(0, 0, 0, 1),
      scale: new Vector3(0.999, 0.999, 0.999)
    }))

    // models placed multiple times
    const ancientPath = this.modelLibrary.ancientPath

    // place models
    staticLocations.ancientPath.forEach(function(location, i) {
      new StaticModel('ancientPath-'+ i, ancientPath, this, location)
    })
  }
}
