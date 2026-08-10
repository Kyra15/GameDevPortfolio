import ASSETS from '../assets.js';
import ANIMATION from '../animation.js';

export default class Player extends Phaser.Physics.Arcade.Sprite
{

    constructor(scene, x, y)
    {
        super(scene, x, y, ASSETS.spritesheet.me.key, 1);

        scene.add.existing(this);
        scene.physics.add.existing(this, true)

        this.setDepth(50);
        this.scene = scene;

        this.anims.play(ANIMATION.me.idle, true);
        this.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);

        this.body.setSize(this.width * 2.8, this.height * 3);
        this.body.setOffset(-60, -40); 

    }

}