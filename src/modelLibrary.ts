export class ModelLibrary {
  altar: GLTFShape
  ancientPath: GLTFShape
  armoredSkeleton: GLTFShape
  blizzard: GLTFShape
  bonePile: GLTFShape
  boss: GLTFShape
  cross: GLTFShape
  fireball: GLTFShape
  grave: GLTFShape
  ground: GLTFShape
  poison: GLTFShape
  portal: GLTFShape
  skeleton: GLTFShape
  storm: GLTFShape
  tomb: GLTFShape

  constructor() {
    this.altar = new GLTFShape('models/altar-portal.glb')
    this.ancientPath = new GLTFShape('models/ancient_path/model.glb')
    this.armoredSkeleton = new GLTFShape('models/armored_skelly.glb')
    this.blizzard = new GLTFShape('models/blizzard.glb')
    this.bonePile = new GLTFShape('models/bone_pile.glb')
    this.boss = new GLTFShape('models/boss.glb')
    this.cross = new GLTFShape('models/cross.glb')
    this.fireball = new GLTFShape('models/fireball.glb')
    this.grave = new GLTFShape('models/grave.glb')
    this.ground = new GLTFShape('models/ground.glb')
    this.poison = new GLTFShape('models/poison.glb')
    this.portal = new GLTFShape('models/portal.glb')
    this.skeleton = new GLTFShape('models/skelly.glb')
    this.storm = new GLTFShape('models/storm.glb')
    this.tomb = new GLTFShape('models/tomb.glb')
  }
}
