import ASSETS from '../assets.js';
import ANIMATION from '../animation.js';

export default class Player extends Phaser.Physics.Arcade.Sprite
{

    constructor(scene, x, y)
    {
        super(scene, x, y, ASSETS.spritesheet.astroidle.key, 1);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.setDepth(100);
        this.scene = scene;
        this.speed = 260 ; 

        this.anims.play(ANIMATION.astro.idle.key, true);
        this.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);

    }

    update (delta)
    {
        const cursors = this.scene.cursors;
        this.setVelocityX(0);

        if (cursors.left.isDown) {
            this.setVelocityX(-this.speed);
            this.anims.play(ANIMATION.astro.left.key, true);
            this.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
        }

        else if (cursors.right.isDown) {
            this.setVelocityX(this.speed);
            this.anims.play(ANIMATION.astro.right.key, true);
            this.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
        }

        else {
            this.anims.play(ANIMATION.astro.idle.key, true);
            this.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
        }

    }

    hit ()
    {
        this.destroy();
    }
}