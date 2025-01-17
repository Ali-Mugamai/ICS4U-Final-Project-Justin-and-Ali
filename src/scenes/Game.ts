/*
 * This is the game scene
 *
 * @author  Ali Mugamai and Justin Lavoie
 * @version 1.0
 * @since   2024-01-15
 */

import Phaser from 'phaser';
import Player from '../sprites/Player'; // Import Player
import Bullet from '../sprites/Bullet'; // Import Bullet class

export class Game extends Phaser.Scene {
    player1: Player;
    player2: Player;
    bullets: Phaser.Physics.Arcade.Group;
    player1HealthText: Phaser.GameObjects.Text;
    player2HealthText: Phaser.GameObjects.Text;
    background: Phaser.GameObjects.TileSprite;
    camera: Phaser.Cameras.Scene2D.Camera;

    private platforms: Phaser.Physics.Arcade.Group;

    constructor() {
        super('Game');
    }

    create() {
        this.sound.play('gamestartup')

        this.camera = this.cameras.main;
        this.camera.setBounds(0, 0, 2048, 1500);

        // Add background as a TileSprite for repeating background
        this.background = this.add.tileSprite(0, 0, 2048, 1576, 'scenery').setOrigin(0, 0);
        this.background.setScrollFactor(0);

        // Set the world bounds so the player can't go below y = 450
        this.physics.world.setBounds(0, 0, 2100, 1000);

        // Create Player 1 (using arrow keys for movement)
        this.player1 = new Player({
            scene: this,
            x: 100,
            y: 900,
            texture: 'player1',
            shootKey: 'SPACE', // Space key for Player 1 to shoot
            controls: 'arrows' // Player 1 uses arrow keys
        }, 100, 0);
        this.add.existing(this.player1);

        // Create Player 2 (using WASD for movement)
        this.player2 = new Player({
            scene: this,
            x: 1500,
            y: 900,
            texture: 'player2',
            shootKey: 'E', // 'E' key for Player 2 to shoot
            controls: 'wasd' // Player 2 uses WASD keys
        }, 100, 0);
        this.add.existing(this.player2);

        // Initialize platforms group
        this.platforms = this.physics.add.group({
            immovable: true,
            allowGravity: false
        });

        // Generate platforms
        for (let counter = 0; counter < 2048; counter += 600) {
            const y = Phaser.Math.Between(400, 1000);
            this.createPlatform(counter, y, 'platform', 1);
        }

        // Set collisions between players and platforms
        this.physics.add.collider(this.player1, this.platforms);
        this.physics.add.collider(this.player2, this.platforms);

        this.bullets = this.physics.add.group({
            classType: Bullet,
            runChildUpdate: true,
        });

        // Handle bullet collisions with players
        this.physics.add.collider(this.player1, this.bullets, this.handleBulletCollision, undefined, this);
        this.physics.add.collider(this.player2, this.bullets, this.handleBulletCollision, undefined, this);
    
        // create text displays for controls to player 1 and player 2
        this.add.text(10, 40, 'Player 1 Controls:', {
            fontFamily: 'Arial Black',
            fontSize: 20,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setScrollFactor(0);

        this.add.text(10, 70, 'Move: Arrow Keys', {
            fontFamily: 'Arial Black',
            fontSize: 20,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setScrollFactor(0);

        this.add.text(10, 100, 'Shoot: Space', {
            fontFamily: 'Arial Black',
            fontSize: 20,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setScrollFactor(0);

        this.add.text(1700, 40, 'Player 2 Controls:', {
            fontFamily: 'Arial Black',
            fontSize: 20,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setScrollFactor(0);

        this.add.text(1700, 70, 'Move: WASD', {
            fontFamily: 'Arial Black',
            fontSize: 20,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setScrollFactor(0);

        this.add.text(1700, 100, 'Shoot: E', {
            fontFamily: 'Arial Black',
            fontSize: 20,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setScrollFactor(0);


        // Create text displays for health and score
        this.player1HealthText = this.add.text(10, 10, 'Player 1 HP: ' + (this.player1?.health ?? 0), {
            fontFamily: 'Arial Black',
            fontSize: 20,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setScrollFactor(0);



        this.player2HealthText = this.add.text(1700, 10, 'Player 2 HP: ' + (this.player2?.health ?? 0), {
            fontFamily: 'Arial Black',
            fontSize: 20,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setScrollFactor(0);


    }

    handleBulletCollision(player, bullet) {
        bullet.handleCollision(player); // Call the bullet's collision handler
        this.sound.play('gameover')
    }

    createPlatform(x: number, y: number, key: string, scale: number) {
        const platform = this.physics.add.sprite(x, y, key).setScale(scale);
        this.platforms.add(platform);
    }

    update() {
        if (this.player1 && this.player2) {
            // Update Player 1
            this.player1.update();
    
            // Update Player 2
            this.player2.update();
    

    
            // Make sure the camera follows Player 1

            // Update text displays for health and score
            this.player1HealthText.setText('Player 1 HP: ' + this.player1.health);
    
            this.player2HealthText.setText('Player 2 HP: ' + this.player2.health);
    
            // Check if any player's health is 0, go to game over
            if (this.player1.health <= 0) {
                this.scene.start('GameOver', { winner: 'Player 2' });
            }
    
            if (this.player2.health <= 0) {
                this.scene.start('GameOver', { winner: 'Player 1' });
            }
        }
    }
}

export default Game;