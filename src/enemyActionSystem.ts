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
    // "enemy-skelly" not preceeded by "statusEffect-"
    if ( /(?<!statusEffect-)enemy-skelly/.test(entity.name) ) { this.enemies.push(entity) }
  }

  update(dt: number) {
    const camera = this.camera
    const playerHelper = this.playerHelper

    this.enemies.forEach(function(enemy) {
      enemy.decrementAttackTimer(dt)

      if ( enemy.hasRecentlyAttacked() )  { return null }
      if ( enemy.hp <= 0 )                { return null }
      if ( enemy.isFrozen() )             { return null }

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

      // Continue to move towards the player until it is within 3m
      if (distance >= 9) {
        // Note: Distance is squared so a value of 9 is when the enemy is standing 3m away
        const forwardVector = Vector3.Forward().rotate(transform.rotation)
        const increment = forwardVector.scale(dt * enemy.speed)

        enemy.walk()
        transform.translate(increment)
      } else {
        // TODO: rethink how damage is assigned to player
        // at the moment player takes damage as soon as the enemy attacks
        // so there's not really a way to dodge attacks - you just take full
        // damage immediately even if you are running through the attack animation
        enemy.attack()
        playerHelper.takeDmg(enemy.dmg)
      }
    })
  }
}
