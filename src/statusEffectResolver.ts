import * as utils from '@dcl/ecs-scene-utils'

export class StatusEffectResolver {
  async resolve(enemy: any, statusEffects: any) {
    // resolve slow
    // applied multiple times and stacks until enemy is frozen
    if ( statusEffects.slow > 0 && !enemy.isFrozen() ) {
      this.resolveSlow(enemy, statusEffects.slow)
    }

    // resolve damage over time
    // applied multiple times but doesn't stack
    if ( statusEffects.dot > 0 && !enemy.isPoisoned() ) {
      this.resolveDamageOverTime(enemy, statusEffects.dot)
    }

    // resolve knockback
    // applied on every hit
    if ( statusEffects.knockback > 0 ) {
      const transform = enemy.getComponent(Transform)
      const backwardVector = Vector3.Backward().rotate(transform.rotation)
      const knockback = backwardVector.scale(statusEffects.knockback)

      transform.translate(knockback)
    }
  }

  private resolveSlow(enemy: any, slow: number) {
    // count existing slow effects
    const index = enemy.statusEffects.map(function(str) { /slow/.test(str) }).length
    const current = 'slow-'+ index

    // apply status effect to enemy
    enemy.statusEffects.push(current)

    log('status', enemy.statusEffects)

    // create slowdown holder entity
    const slowdownHolder = new Entity('statusEffect-'+ enemy.name +'-slowdownHolder-'+ index)
    slowdownHolder.setParent(enemy)

    // prepare slowdown and apply to enemy
    const slowdown = this.slowdownEnemy(enemy, slow, index, slowdownHolder)
    slowdownHolder.addComponentOrReplace(slowdown)
    engine.addEntity(slowdownHolder)
  }

  private resolveDamageOverTime(enemy: any, poisonDmg: number) {
    // apply status effect to enemy
    enemy.statusEffects.push('dot')

    // create poison holder entity
    const poisonHolder = new Entity('statusEffect-'+ enemy.name +'-poisonHolder')
    poisonHolder.setParent(enemy)

    // prepare poison and apply to enemy
    const poison = this.preparePoison(enemy, poisonDmg, poisonHolder)
    poisonHolder.addComponent(poison)
    engine.addEntity(poisonHolder)
  }

  private slowdownEnemy(enemy: any, slowdown: number, index: number, slowdownHolder: Entity) {
    const slowdownTimeout = 3000

    enemy.speed -= slowdown
    if ( enemy.speed <= 0 ) { enemy.freeze() }

    return new utils.Delay(slowdownTimeout, ()=> {
      // remove slow after it has run its course
      engine.removeEntity(slowdownHolder)
      enemy.statusEffects.splice(enemy.statusEffects.indexOf('slow-'+ index), 1)
      enemy.speed += slowdown
    })
  }

  private preparePoison(enemy: any, poisonDmg: number, poisonHolder: Entity)  {
    let poisonCounter = 2

    return new utils.Interval(666, ()=> {
      // remove poison after it has run its course
      if ( poisonCounter === 0 ) {
        poisonHolder.removeComponent(utils.Interval)
        engine.removeEntity(poisonHolder)
        enemy.statusEffects.splice(enemy.statusEffects.indexOf('dot'), 1)
      }

      // apply poison damage while in effect
      // TODO: pass in damage type so poison can have a different sound effect
      enemy.takeDmg(poisonDmg, 1, {})

      // decrement poison counter
      poisonCounter --
    })
  }
}
