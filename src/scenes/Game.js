import ASSETS from '../assets.js';
import ANIMATION from '../animation.js';
import Player from '../gameObjects/Player.js';
import Me from '../gameObjects/Me.js';
import Indicator from '../gameObjects/Interact.js';

export class Game extends Phaser.Scene
{
    constructor()
    {
        super('Game');
    }

    create ()
    {
        this.initVariables();
        this.initGameUi();
        this.initAnimations();
        this.initInput();
        this.initGroups();
        this.initPlayer();
        this.initMe();
        this.initPhysics();
        this.initPosterSprites();
        this.initIndicators();

        this.dialogData = this.cache.json.get('dialogData');
    }

    update (time, delta) {
        if (!this.gameStarted) return;

        this.player.update(delta);
        this.updateIndicators();
    }


    initVariables ()
    {
        this.gameStarted = false;
        this.centreX = this.scale.width * 0.5;
        this.centreY = this.scale.height * 0.5;
        const bg = this.add.image(this.centreX, this.centreY, 'bg');
        bg.scale = 4;
        bg.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
        bg.z = -100

        this.playerStart = { x: 0, y: 484 };
        this.meStart = { x: 324, y: 456 };
    }

    initGameUi ()
    {
        // Create tutorial text
        this.tutorialText = this.add.text(this.centreX, this.centreY, 'Arrow keys to move\nE to interact\nSpace to start or advance text!', {
            fontFamily: 'gamjaFlower', fontSize: 60, color: '#ffffff',
            stroke: '#23406e', strokeThickness: 8,
            align: 'center'
        })
            .setOrigin(0.5)
            .setDepth(250);
        
        this.tutorialRect = this.add.rectangle(this.centreX, this.centreY, 
            this.scale.width, this.scale.height, '#000000', 0.5).setDepth(200)
    }

    initAnimations ()
    {
        const astroAnimations = ANIMATION.astro;
        for (const key in astroAnimations)
        {
            const animation = astroAnimations[ key ];

            this.anims.create({
                key: animation.key,
                frames: this.anims.generateFrameNumbers(animation.texture, animation.config),
                frameRate: animation.frameRate,
                repeat: animation.repeat
            });
        };

        const meAnimations = ANIMATION.me;
        for (const key in meAnimations)
        {
            const animation = meAnimations[ key ];

            this.anims.create({
                key: animation.key,
                frames: this.anims.generateFrameNumbers(animation.texture, animation.config),
                frameRate: animation.frameRate,
                repeat: animation.repeat
            });
        };
    }

    initGroups ()
    {
        this.interactGroup = this.add.group();
    }

    initPhysics ()
    {

        this.activeTarget = null;
    }

    initPlayer ()
    {
        this.player = new Player(this, this.playerStart.x, this.playerStart.y);
        this.player.scale = 4
    }

    initPosterSprites ()
    {
        this.nolb = this.physics.add.staticImage(520, 304, 'nolb');
        this.nolb.scale = 4;
        this.nolb.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
        this.nolb.refreshBody();

        this.paddle = this.physics.add.staticImage(736, 304, 'paddle');
        this.paddle.scale = 4;
        this.paddle.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
        this.paddle.refreshBody();

        this.combo = this.physics.add.staticImage(952, 304, 'combo');
        this.combo.scale = 4;
        this.combo.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
        this.combo.refreshBody();
    }

    initMe ()
    {
        this.me = new Me(this, this.meStart.x, this.meStart.y);
        this.me.scale = 4;
    }

    initInput ()
    {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.input.keyboard.once("keydown-SPACE", () => {
			this.startGame();
		});

        this.input.keyboard.on("keydown-E", () => {
            this.handleInteract();
        });
    }

    initIndicators ()
    {

        this.nolb.indicator = new Indicator(this, this.nolb.x, this.nolb.y - 144, 'indicatorIcon');
        this.paddle.indicator = new Indicator(this, this.paddle.x, this.paddle.y - 144, 'indicatorIcon');
        this.combo.indicator = new Indicator(this, this.combo.x, this.combo.y - 144, 'indicatorIcon');
        this.me.indicator = new Indicator(this, this.me.x, this.me.y - 200, 'indicatorIcon');

        [this.nolb, this.paddle, this.combo, this.me].forEach(target => {
            target.indicator.setVisible(false);
            this.interactGroup.add(target);
        });

    }

    updateIndicators ()
    {
        let nearest = null;
        let nearestDist = Infinity;

        this.interactGroup.getChildren().forEach(target => {
            const overlapping = this.physics.overlap(this.player, target);
            if (overlapping) {
                const dist = Phaser.Math.Distance.Between(
                    this.player.x, this.player.y, target.x, target.y
                );
                if (dist < nearestDist) {
                    nearestDist = dist;
                    nearest = target;
                }
            }
        });

        if (nearest !== this.activeTarget) {
            // hide the old one
            if (this.activeTarget) {
                this.activeTarget.indicator.setVisible(false);
            }
            // show the new one
            if (nearest) {
                nearest.indicator.setVisible(true);
                nearest.indicator.startPulse()
            }
            this.activeTarget = nearest;
        }
    }

    handleInteract ()
    {
        if (!this.activeTarget) return;

        switch (this.activeTarget) {
            case this.nolb: this.enterGame('nolb'); break;
            case this.paddle: this.enterGame('paddle'); break;
            case this.combo: this.enterGame('combo'); break;
            case this.me: this.showDialog(); break;
        }
    }

    showDialog() {
        const main = this.dialogData.main
        this.scene.launch('DialogScene', {
            speaker: main.speaker,
            lines: main.lines,
            options: main.options
        })
    }

    enterGame(name) {
        console.log("entering" + name)
    }

    startGame ()
    {
        this.gameStarted = true;
        this.tutorialText.setVisible(false);
        this.tutorialRect.setVisible(false);
    }

    GameOver ()
    {
        this.gameStarted = false;
        this.gameOverText.setVisible(true);
    }
}
