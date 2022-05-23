import { GameUI } from './gameUI'
import { Player } from './player'
import { PlayerActionHelper } from './playerActionHelper'
import { Spell } from './spell'
import { SoundLibrary } from './soundLibrary'
import { Scene } from './scene'

// Spells //
// Blizzard: Water damage [ Enemy SPD- ] [ Knockback ]
// Fireball: Fire damage [ DMG+ ] [ ATK SPD+ ]
// Creeping vines: Earth damage [ Enemy SPD- ] [ DMG +]
// Storm: Lightning damage [ Knockback ] [ ATK SPD + ]

// set scene constants
const _scene        = new Scene()
const camera        = Camera.instance
const canvas        = new UICanvas()
const input         = Input.instance
const physicsCast   = PhysicsCast.instance
const player        = new Player()
const soundLibrary  = new SoundLibrary()

// spells
const blizzard      = new Spell('blizzard', 'iceball.gltf', {'slow': 1, 'knockback': 1})
const vines         = new Spell('vines', 'poison.gltf', {'slow': 1, 'dmg': 2.5})
const fireball      = new Spell('fireball', 'fireball.gltf', {'dmg': 2.5, 'atkSpeed': 1})
const storm         = new Spell('storm', 'trashy.gltf', {'knockback': 1, 'atkSpeed': 1})
const spells        = [blizzard, vines, fireball, storm]

// game UI
const gameUI        = new GameUI(canvas, player, soundLibrary, spells)
const playerHelper  = new PlayerActionHelper(player, gameUI)

// run initializers
_scene.addModifiers()
gameUI.displayIntroduction()
player.initialize()
player.restrictMovement()
playerHelper.startRegeneration()

const maze = new Entity()
maze.addComponent(
  new Transform({
    position: new Vector3(32, 0, 32),
    scale: new Vector3(2, 1, 2),
    rotation: Quaternion.Euler(0, 0, 0)
  })
)

maze.setParent(_scene)
engine.addEntity(maze)

const mazeModel = new GLTFShape('models/maze.glb')
maze.addComponent(mazeModel)
mazeModel.visible = true
mazeModel.withCollisions = true

input.subscribe("BUTTON_DOWN", ActionButton.POINTER, false, (e) => {
  selectNextSpell()
})

input.subscribe("BUTTON_DOWN", ActionButton.PRIMARY, true, (e) => {
  let activeSpell = player.activeSpell

  if ( player.stats.mana >= activeSpell.manaCost ) {
    log('casting ', activeSpell.name)
    log('stats', activeSpell.viewStats())

    let ray: Ray = {
      origin: camera.position,
      direction: Vector3.Forward().rotate(camera.rotation),
      distance: player.stats.rangeBonus + activeSpell.range
    }

    physicsCast.hitFirst(
      ray,
      (e) => {
        if (e.didHit) {
          let origin = new Vector3(camera.position.x, camera.position.y - 0.4, camera.position.z)
          let target = Vector3.Zero().copyFrom(e.hitPoint)

          // decrement mana pool
          playerHelper.diminishMana(activeSpell.manaCost)

          // cast spell
          activeSpell.cast(origin, target, 200)
        }
      },
      1
    )
  }
})

input.subscribe("BUTTON_DOWN", ActionButton.SECONDARY, false, (e) => {
})

function selectNextSpell() {
  const knownSpells = spells.filter(spell => spell.level > 0) // TODO: add to player as well
  let active = knownSpells.indexOf(player.activeSpell)

  // increment counter
  active++;

  // reset counter if we reach end of array
  if (active === knownSpells.length) {
    active = 0;
  }

  // update active spell
  // TODO: module to group player + playerUI commands
  let newSpell = knownSpells[active]
  player.setActiveSpell(newSpell)
  gameUI.playerUI.setActiveSpell(newSpell)
}
