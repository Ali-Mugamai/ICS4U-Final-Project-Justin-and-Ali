// src/scenes/GameOver.ts
import Phaser from 'phaser';

export class GameOver extends Phaser.Scene {
    private winnerText: Phaser.GameObjects.Text;

    constructor() {
        super('GameOver');
    }

    create(data: { winner: string }) {
        const winner = data.winner || 'No one';
        this.winnerText = this.add.text(960, 540, `${winner} Wins!`, {
            fontFamily: 'Arial Black',
            fontSize: 64,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(0.5);

        this.input.once('pointerdown', () => {
            this.scene.start('MainMenu');
        });
    }
}

export default GameOver;