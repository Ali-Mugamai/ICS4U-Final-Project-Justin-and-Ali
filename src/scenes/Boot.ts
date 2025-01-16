/*
 * This is the bootup scene for the game
 *
 * @author  Ali Mugamai and Justin Lavoie
 * @version 1.0
 * @since   2024-01-15
 */

import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

        this.load.image('background', 'assets/image.png');
    }

    create ()
    {
        this.scene.start('Preloader');
    }
}
