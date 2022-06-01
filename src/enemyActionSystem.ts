import { PlayerActionHelper } from './playerActionHelper'

export class EnemyActionSystem implements ISystem {
  enemies = []
  camera: Camera
  playerHelper: PlayerActionHelper

  constructor(camera, playerHelper) {
    this.camera = camera
    this.playerHelper = playerHelper
  }

  onAddEntity(entity: Entity) {
    if ( /skelly/.test(entity.name) ) { this.enemies.push(entity) }
  }

  update(dt: number) {
    const camera = this.camera
    const playerHelper = this.playerHelper

    this.enemies.forEach(function(enemy) {
      const transform = enemy.getComponent(Transform)

      // Rotate to face the player
      const lookAtTarget = new Vector3(
        camera.position.x,
        camera.feetPosition.y,
        camera.position.z
      )

      const direction = lookAtTarget.subtract(transform.position)
      transform.rotation = Quaternion.Slerp(
        transform.rotation,
        Quaternion.LookRotation(direction),
        dt * enemy.speed
      )

      // Check distance squared as it's more optimized
      const distance = Vector3.DistanceSquared(
        transform.position,
        camera.position
      )

      if ( enemy.hp > 0 ) {
        // Continue to move towards the player until it is within 3m
        if (distance >= 9) {
          // Note: Distance is squared so a value of 9 is when the enemy is standing 3m away
          const forwardVector = Vector3.Forward().rotate(transform.rotation)
          const increment = forwardVector.scale(dt * enemy.speed)

          enemy.walk()
          transform.translate(increment)
        } else {
          if ( enemy.isFrozen() ) { return null }

          enemy.attack()
          playerHelper.diminishHp(enemy.dmg)
        }
      }
    })
  }
}
