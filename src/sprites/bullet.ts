import { Physics, Scene } from 'phaser';
import Player1 from './Player';  // Correct path for Player1
import Player2 from './Player2';  // Correct path for Player2

class Bullet extends Physics.Arcade.Image {
    constructor(scene: Scene, x: number, y: number, velocityX: number) {
        super(scene, x, y, 'bullet'); // 'bullet' should be the key for the bullet image

        // Add the bullet to the scene
        scene.add.existing(this);
        scene.physics.world.enable(this);

        this.setVelocityX(velocityX); // Bullet moves horizontally (positive or negative based on velocityX)
        this.setCollideWorldBounds(false); // Optional: set true if you want bullets to stop at the world bounds
        this.setActive(true); // Mark bullet as active
        this.setVisible(true); // Bullet is visible
    }

    update() {
        if (this.x > 2048 || this.x < 0) { // Destroy the bullet if it goes off-screen
            this.destroy();
        }
    }

    // Handle collision with players
    handleCollision(player: Player1 | Player2) {
        if (player.health > 0) {
            player.health -= 15;  // Decrease health by 15 when hit by a bullet
            this.destroy();  // Destroy the bullet
        }
    }
}

export default Bullet;
