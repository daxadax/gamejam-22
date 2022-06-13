export class ModelLibrary {
  altar: GLTFShape
  armoredSkeleton: GLTFShape
  ancientPath: GLTFShape
  boss: GLTFShape
  ground: GLTFShape
  portal: GLTFShape
  skeleton: GLTFShape
  fireball: GLTFShape
  blizzard: GLTFShape
  poison: GLTFShape
  storm: GLTFShape

  constructor() {
    this.altar = new GLTFShape('models/altar-portal.glb')
    this.ancientPath = new GLTFShape('models/ancient_path/model.glb')
    this.armoredSkeleton = new GLTFShape('models/armored_skelly.glb')
    this.blizzard = new GLTFShape('models/blizzard.glb')
    this.boss = new GLTFShape('models/boss.glb')
    this.fireball = new GLTFShape('models/fireball.glb')
    this.ground = new GLTFShape('models/ground.glb')
    this.poison = new GLTFShape('models/poison.glb')
    this.portal = new GLTFShape('models/portal.glb')
    this.skeleton = new GLTFShape('models/skelly.glb')
    this.storm = new GLTFShape('models/storm.glb')
  }
}
