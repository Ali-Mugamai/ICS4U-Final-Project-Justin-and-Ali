// src/scenes/GameOver.ts

/*
 * This is the gameover scene for the game
 *
 * @author  Ali Mugamai and Justin Lavoie
 * @version 1.0
 * @since   2024-01-15
 */

import Phaser from 'phaser';

export class GameOver extends Phaser.Scene {
    private winnerImage: Phaser.GameObjects.Image;

    constructor() {
        super('GameOver');
    }

    create(data: { winner: string }) {
        // Play the gameover sound
        this.sound.play('win');

        // Determine the winner image key
        let winnerImageKey: string;

        if (data.winner === 'Player 1') {
            winnerImageKey = 'win1'; // Replace with Player 1's winning image key
        } else if (data.winner === 'Player 2') {
            winnerImageKey = 'win2'; // Replace with Player 2's winning image key
        } else {
            winnerImageKey = 'logo2'; // Default image if no winner
        }

        // Display the winner image
        this.winnerImage = this.add.image(960, 540, winnerImageKey).setOrigin(0.5);

        // Add click-to-continue interaction
        this.input.once('pointerdown', () => {
            this.scene.start('MainMenu');
        });
    }
}

export default GameOver;
