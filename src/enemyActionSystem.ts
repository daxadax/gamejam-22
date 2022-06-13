import { PlayerActionHelper } from './playerActionHelper'

export class EnemyActionSystem implements ISystem { enemies = []
  camera: Camera
  playerHelper: PlayerActionHelper

  constructor(camera, playerHelper) {
    this.camera = camera
    this.playerHelper = playerHelper
  }

  onAddEntity(entity: Entity) {
    if ( this.isMinion(entity.name) ) { this.enemies.push(entity) }
    if ( this.isBoss(entity.name) ) { this.enemies.push(entity) }
  }

  update(dt: number) {
    const self = this

    this.enemies.forEach(function(enemy) {
      enemy.decrementAttackTimer(dt)

      if ( enemy.hp <= 0 )                { return null }
      if ( enemy.isFrozen() )             { return null }

      const transform = enemy.getComponent(Transform)

      // Rotate to face the player
      const lookAtTarget = new Vector3(
        self.camera.position.x,
        self.camera.feetPosition.y,
        self.camera.position.z
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
        self.camera.position
      )

      if ( self.isMinion(enemy.name) ) {
        self.handleMinionAttack(distance, transform, dt, enemy)
      } else {
        self.handleBossAttack(distance, transform, dt, enemy)
      }
    })
  }

  // really this is handle melee attack
  handleMinionAttack(distance: number, transform: Transform, dt: number, enemy: any) {
    // Continue to move towards the player until it is within 3m
    if ( distance >= 9 ) {
      // Note: Distance is squared so a value of 9 is when the enemy is standing 3m away
      const forwardVector = Vector3.Forward().rotate(transform.rotation)
      const increment = forwardVector.scale(dt * enemy.speed)

      enemy.walk()
      transform.translate(increment)
    } else {
      if ( enemy.hasRecentlyAttacked() )  { return null }
      // TODO: rethink how damage is assigned to player
      // at the moment player takes damage as soon as the enemy attacks
      // so there's not really a way to dodge attacks - you just take full
      // damage immediately even if you are running through the attack animation
      enemy.attack()
      this.playerHelper.takeDmg(enemy.dmg)
    }
  }

  // and this is handle casting
  handleBossAttack(distance: number, transform: Transform, dt: number, enemy: any) {
    if ( enemy.isVisible() != true ) { return null }
    const range = 200

    // If closer than range, blink away and cast a spell at the player
    if ( distance < range ) {
      // play blink sound and stop casting
      enemy.blink()

      // TODO: depending on scene size this number is different,
      // so this should be in game state or another list of constants
      // teleport boss to random tile
      transform.position.x = Math.floor(Math.random() * 62) + 1
      transform.position.z = Math.floor(Math.random() * 62) + 1
    } else if ( distance > range ) {
      if ( enemy.hasRecentlyAttacked() )  { return null }
      // save player position at the time of casting to compare later
      const targetPosition = Vector3.Zero().copyFrom(this.camera.position)
      enemy.castSpell(targetPosition)
    }
  }

  // "enemy-skelly" not preceeded by "statusEffect-"
  isMinion(name: string) {
    if ( /(?<!statusEffect-)enemy-skelly/.test(name) )          { return true }
    if ( /(?<!statusEffect-)enemy-armored-skelly/.test(name) )  { return true }
    return false
  }

  isBoss(name: string) {
    if ( /(?<!statusEffect-)enemy-boss/.test(name) ) { return true }
    return false
  }
}
