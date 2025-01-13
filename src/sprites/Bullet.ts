import { Physics, Scene } from 'phaser';
import Player from './Player';  // Correct path for Player

class Bullet extends Physics.Arcade.Sprite {
    owner: Player;

    constructor(scene: Scene, x: number, y: number, velocityX: number, owner: Player) {
        super(scene, x, y, 'bullet'); // 'bullet' should be the key for the bullet image

        // Add the bullet to the scene
        scene.add.existing(this);
        scene.physics.world.enable(this);

        this.setVelocityX(velocityX); // Bullet moves horizontally (positive or negative based on velocityX)
        this.setCollideWorldBounds(true); // Set true to make bullets stop at the world bounds
        this.setActive(true); // Mark bullet as active
        this.setVisible(true); // Bullet is visible

        this.owner = owner; // Set the owner of the bullet
    }

    update() {
        if (this.x > 2048 || this.x < 0) { // Destroy the bullet if it goes off-screen
            this.destroy();
        }
    }

    // Handle collision with players
    handleCollision(player: Player) {
        if (player !== this.owner && player.health > 0) { // Check if the player is not the owner
            player.health -= 15;  // Decrease health by 15 when hit by a bullet
            this.destroy();  // Destroy the bullet after collision
        }
    }
}

export default Bullet;
