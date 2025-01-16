/*
 * This is the mainmenu scene for the game
 *
 * @author  Ali Mugamai and Justin Lavoie
 * @version 1.0
 * @since   2024-01-15
 */

import { Scene, GameObjects } from 'phaser';

export class MainMenu extends Scene
{
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.background = this.add.image(1920 / 2, 1080 / 2, "logo2");


        this.title = this.add.text(1920 / 2, 1080 / 2, 'Start Game', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'auto'
        }).setOrigin(0.5);

        this.input.once('pointerdown', () => {

            this.scene.start('Game');

        });
    }
}