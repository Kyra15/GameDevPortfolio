export default class Indicator extends Phaser.GameObjects.Sprite
{
    constructor(scene, x, y, texture)
    {
        super(scene, x, y, texture);

        scene.add.existing(this);

        this.setDepth(100);
        this.scene = scene;

        this.scale = 4;
        this.baseY = y;
        this.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);

        // this.startPulse();

    }

    startPulse() {
        this.scale = 4;
        this.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
        this.pulseTween = this.scene.tweens.add({
            targets: this,
            y: { from: this.baseY, to: this.baseY - 8 },
            alpha: { from: 1, to: 0.6 },
            duration: 600,
            yoyo: true,
            repeat: -1,
            ease: 'Sin.easeInOut'
        });
    }

    stopPulse() {
        if (this.pulseTween) {
            this.pulseTween.stop();
            this.setScale(1).setAlpha(1);
            this.y = this.baseY;
        }
    }

    destroy(fromScene) {
        if (this.pulseTween) this.pulseTween.stop();
        super.destroy(fromScene);
    }
}