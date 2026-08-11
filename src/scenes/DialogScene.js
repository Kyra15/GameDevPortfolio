export class DialogScene extends Phaser.Scene {

    constructor() {

        super('DialogScene');

    }

    create ( data ) {

        this.pendingClose = false;
        this.lines = data.lines;
        this.options = data.options || null;
        this.speaker = data.speaker || '';

        this.lineIndex = 0;
        this.isTyping = false;
        this.typeEvent = null;
        this.optionTexts = [];

        this.boxWidth = 1100;
        this.baseBoxHeight = 160;
        this.boxX = (1280 - this.boxWidth)/2;
        this.boxBottomY = 546 + this.baseBoxHeight;

        this.boxState = { height: 4 };

        this.visible = false;
        this.openDialog()
    }

    getBoxTopY() {
        return this.boxBottomY - this.boxState.height;
    }

    drawBox(height) {
        const topY = this.boxBottomY - height;
        this.rect.clear();
        this.rect.fillStyle(0x000000, 1);
        this.rect.lineStyle(4, 0x6691ed, 1);
        this.rect.fillRect(this.boxX, topY, this.boxWidth, height);
        this.rect.strokeRect(this.boxX, topY, this.boxWidth, height);

        if (this.speakerName) {
            this.speakerName.setY(topY + 2);
        }
        if (this.dialogText) {
            this.dialogText.setY(topY + 40);
        }
    }

    handleSpace() {
        if (this.isTyping) {
            // skip
            this.typeEvent.remove();
            this.dialogText.text = this.lines[this.lineIndex];
            this.isTyping = false;
            return;
        }

        if (this.optionTexts.length > 0) return;

        this.lineIndex += 1;
        if (this.lineIndex < this.lines.length) {
            this.typewriteText(this.lines[this.lineIndex]);
        } else if (this.pendingClose) {
            this.closeDialog();
        } else if (this.options) {
            this.growBoxForOptions(this.options);
        } else {
            this.closeDialog();
        }
    }

    typewriteText(text) {
        this.dialogText.text = "";
        this.isTyping = true;
        const length = text.length;
        let i = 0;
        this.typeEvent = this.time.addEvent({
            callback: () => {
                this.dialogText.text += text[i];
                i++;
                if (i >= length) {
                    this.isTyping = false;
                }
            },
            repeat: length - 1,
            delay: 50
        });
    }

    growBoxForOptions(options) {

        const lineHeight = 40;
        const padding = 60;
        const targetHeight = padding + options.length * lineHeight + 20 ;

        this.tweens.add({
            targets: this.boxState,
            height: targetHeight,
            duration: 300,
            ease: 'Cubic.easeOut',
            onUpdate: () => {
                this.drawBox(this.boxState.height);
            },
            onComplete: () => {
                this.showOptions(options, lineHeight);
            }
        });
    }
 
    showOptions(options, lineHeight) {
        
        this.clearOptions();

        const startY = this.getBoxTopY() + 80 ;

        options.forEach((option, index) => {
            const optionText = this.add.text(
                this.boxX + 240,
                startY + index * lineHeight,
                `> ${option.text}`,
                {
                    fontFamily: "gamjaFlower",
                    fontSize: '26px',
                    fill: '#ffffff'
                }
            )
                .setResolution(2)
                .setAlpha(0)
                .setInteractive({ useHandCursor: true });

            optionText.on('pointerover', () => optionText.setColor('#6691ed'));
            optionText.on('pointerout', () => optionText.setColor('#ffffff'));
            optionText.on('pointerdown', () => this.selectOption(option));

            this.tweens.add({
                targets: optionText,
                alpha: 1,
                duration: 200,
                delay: index * 60
            });

            this.optionTexts.push(optionText);
        });
    }

    clearOptions() {
        this.optionTexts.forEach(t => t.destroy());
        this.optionTexts = [];
    }

    shrinkBoxToBase(onComplete) {
        this.tweens.add({
            targets: this.boxState,
            height: this.baseBoxHeight,
            duration: 250,
            ease: 'Cubic.easeIn',
            onUpdate: () => {
                this.drawBox(this.boxState.height);
            },
            onComplete
        });
    }

    selectOption(option) {
        this.clearOptions();

        this.pendingClose = (option.text === "Exit");

        if (option.lines && option.lines.length > 0) {
            this.shrinkBoxToBase(() => {
                this.lines = option.lines;
                this.lineIndex = 0;
                this.dialogText.text = '';
                this.typewriteText(this.lines[this.lineIndex]);
            });
        } else {
            this.closeDialog();
        }
    }

    openDialog() {
        this.rect = this.add.graphics();
        this.drawBox(this.boxState.height);

        this.speakerName = this.add.text(this.boxX + 240, this.getBoxTopY() + 2, this.speaker, {
            fontFamily: "gamjaFlower", 
            fontSize: '36px', 
            fill: '#6691ed' 
        }).setResolution(2).setAlpha(0); 

        this.dialogText = this.add.text(this.boxX + 240, this.getBoxTopY() + 40, '', {
            fontFamily: "gamjaFlower",
            fontSize: '32px',
            fill: '#ffffff',
            wordWrap: { width: this.boxWidth - 240 - 40 }
        }).setResolution(2).setAlpha(0);

        this.dialogImage = this.add.image(this.boxX + 112, this.getBoxTopY() - 94, 'dialogImg').setAlpha(0);
        this.dialogImage.scale = 4;
        this.dialogImage.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);


        this.tweens.add({
            targets: this.boxState,
            height: this.baseBoxHeight,
            duration: 300,
            ease: 'Cubic.easeOut',
            onUpdate: () => {
                this.drawBox(this.boxState.height);
            },
            onComplete: () => {
                this.speakerName.setAlpha(1);
                this.dialogText.setAlpha(1);
                this.dialogImage.setAlpha(1);
                this.typewriteText(this.lines[this.lineIndex]);
                this.input.keyboard.on('keydown-SPACE', this.handleSpace, this);
            }
        });
    }

    closeDialog() {
        this.input.keyboard.off('keydown-SPACE', this.handleSpace, this);
        this.clearOptions();
        this.speakerName.setAlpha(0);
        this.dialogText.setAlpha(0);
        this.dialogImage.setAlpha(0);
        this.tweens.add({
            targets: this.boxState,
            height: 4,
            duration: 300,
            ease: 'Cubic.easeIn',
            onUpdate: () => {
                this.drawBox(this.boxState.height);
            },
            onComplete: () => {
                this.input.keyboard.off('keydown-SPACE', this.handleSpace, this);
                this.scene.stop();
            }
        });
    }
}