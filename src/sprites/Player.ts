/*
 * This is the Player class for the game
 *
 * @author  Ali Mugamai and Justin Lavoie
 * @version 1.0
 * @since   2024-01-15
 */

import { Physics, Scene } from 'phaser';
import Bullet from './Bullet'; // Ensure the correct import path for Bullet
import Phaser from 'phaser';

interface PlayerConfig {
    scene: Scene;
    x: number;
    y: number;
    texture: string;
    shootKey: string; // Add shoot key as part of config
    controls: 'arrows' | 'wasd'; // Control scheme (arrows for Player 1, WASD for Player 2)
}

class Player extends Physics.Arcade.Sprite {
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null;
    private wasdKeys: {
        W: Phaser.Input.Keyboard.Key;
        A: Phaser.Input.Keyboard.Key;
        S: Phaser.Input.Keyboard.Key;
        D: Phaser.Input.Keyboard.Key;
    } | null;
    private shootKey: Phaser.Input.Keyboard.Key | null; // Store shoot key
    public health: number = 100;
    public score: number;
    private lastShotTime: number = 0; // Track the last shot time
    private shootCooldown: number = 450; // Cooldown between shots (450ms)

    constructor(config: PlayerConfig, health: number, score: number) {
        super(config.scene, config.x, config.y, config.texture);

        // Enable physics
        config.scene.physics.world.enable(this);
        config.scene.add.existing(this);

        // Set collide with world bounds
        this.setCollideWorldBounds(true);

        // Set controls based on player (Player 1 uses arrow keys, Player 2 uses WASD)
        if (config.controls === 'arrows') {
            this.cursors = config.scene.input.keyboard?.createCursorKeys() || null;
            this.wasdKeys = null;
        } else {
            this.cursors = null;
            this.wasdKeys = {
                W: config.scene.input.keyboard?.addKey('W') || null,
                A: config.scene.input.keyboard?.addKey('A') || null,
                S: config.scene.input.keyboard?.addKey('S') || null,
                D: config.scene.input.keyboard?.addKey('D') || null,
            };
        }

        // Create shoot key
        this.shootKey = config.scene.input.keyboard?.addKey(config.shootKey) || null;

        // Initialize the shoot key listener
        this.initializeShootKey();

        // Health and score
        this.health = health;
        this.score = score;

        // Apply gravity
        (this.body as Phaser.Physics.Arcade.Body).setGravityY(300);
    }

    // Initialize the shoot key listener
    initializeShootKey() {
        // When shoot key is released, reset to idle sprite
        this.shootKey?.on('up', () => {
            if (this.texture.key === 'gun1') {
                // If Player 1 released shoot key, reset to idle sprite (player1)
                this.setTexture('player1');
            } else if (this.texture.key === 'gun2') {
                // If Player 2 released shoot key, reset to idle sprite (player2)
                this.setTexture('player2');
            }
        });
    }

    // Create bullet when the shoot key is pressed
    shootBullet() {
        const currentTime = this.scene.time.now;

        // Ensure a bullet can only be shot if enough time has passed since the last shot
        if (this.shootKey?.isDown && currentTime - this.lastShotTime > this.shootCooldown) {
            // Create and configure the bullet
            const bullet = new Bullet(this.scene, this.x, this.y, this.flipX ? -300 : 300, this);
            this.scene.bullets.add(bullet);
            this.lastShotTime = currentTime;

            this.scene.sound.play('boom')

            // Adjust direction based on the player control scheme
            if (this.cursors) {
                this.setTexture('gun1'); // Player 1's shooting texture
                bullet.setVelocityX(500); // Move bullet to the right (Player 1)
            } else {
                this.setTexture('gun2'); // Player 2's shooting texture
                bullet.setVelocityX(-300); // Move bullet to the left (Player 2)
            }
        }
    }

    update() {
        // Call shootBullet method when shoot key is pressed
        this.shootBullet();
        if (this.cursors) {
            const speed = 200;

            // Horizontal movement for Player 1 (using arrow keys)
            if (this.cursors.left?.isDown) {
                this.setVelocityX(-speed);
            } else if (this.cursors.right?.isDown) {
                this.setVelocityX(speed);
            } else {
                this.setVelocityX(0);
            }

            // Jumping for Player 1 (using arrow keys)
            if (this.cursors.up?.isDown) {
                this.setVelocityY(-150);
            }

        } else if (this.wasdKeys) {
            const speed = 200;

            // Horizontal movement for Player 2 (using WASD keys)
            if (this.wasdKeys.A.isDown) {
                this.setVelocityX(-speed);
            } else if (this.wasdKeys.D.isDown) {
                this.setVelocityX(speed);
            } else {
                this.setVelocityX(0);
            }

            // Jumping for Player 2 (using WASD keys)
            if (this.wasdKeys.W.isDown) {
                this.setVelocityY(-150);
            }
        }
    }
}

export default Player;
