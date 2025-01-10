import Phaser from 'phaser';
import Player from '../sprites/Player';
import Player2 from '../sprites/Player2';
import Bullet from '../sprites/bullet';

export class Game extends Phaser.Scene {
    private camera: Phaser.Cameras.Scene2D.Camera;
    private background: Phaser.GameObjects.TileSprite;

    private player1HealthText: Phaser.GameObjects.Text;
    private player1ScoreText: Phaser.GameObjects.Text;
    private player2HealthText: Phaser.GameObjects.Text;
    private player2ScoreText: Phaser.GameObjects.Text;

    private helpText: Phaser.GameObjects.Text;

    private player1: Player | null = null;
    private player2: Player2 | null = null;
    private platforms: Phaser.Physics.Arcade.Group;
    private finalScore: number = 0;
    private bullets: Bullet;

    constructor() {
        super('Game');
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBounds(0, 0, 2048, 1500);

        // Add background as a TileSprite for repeating background
        this.background = this.add.tileSprite(0, 0, 2048, 1576, 'scenery').setOrigin(0, 0);
        this.background.setScrollFactor(0);

        // Set the world bounds so the player can't go below y = 450
        this.physics.world.setBounds(0, 0, 2100, 1000);

        // Create Player 1
        this.player1 = new Player(
            {
                scene: this,
                x: 100,
                y: 450,
                texture: 'player1',
                shootKey: 'SPACE' // Space key for Player 1 to shoot
            },
            100,
            0
        );

        this.add.existing(this.player1);

        // Create Player 2
        this.player2 = new Player2(
            {
                scene: this,
                x: 600,
                y: 450,
                texture: 'player2',
                shootKey: 'E' // 'E' key for Player 2 to shoot
            },
            100,
            0
        );

        this.add.existing(this.player2);

        // Set player body properties
        const player1Body = this.player1.body as Phaser.Physics.Arcade.Body;
        player1Body.setAllowGravity(true);
        player1Body.setImmovable(false);

        const player2Body = this.player2.body as Phaser.Physics.Arcade.Body;
        player2Body.setAllowGravity(true);
        player2Body.setImmovable(false);

        // Initialize platforms group
        this.platforms = this.physics.add.group({
            immovable: true,
            allowGravity: false
        });

        // Generate platforms
        for (let counter = 0; counter < 2048; counter += 600) {
            const y = Phaser.Math.Between(500, 200);
            this.createPlatform(counter, y, 'platform', 1);
        }

        // Set collisions between players and platforms
        this.physics.add.collider(this.player1, this.platforms);
        this.physics.add.collider(this.player2, this.platforms);

        // Set collisions between players and bullets
        this.physics.add.collider(this.player1, this.bullets);
        this.physics.add.collider(this.player2, this.bullets);


        // Create text displays for health and score
        this.player1HealthText = this.add.text(10, 10, 'Player 1 HP: ' + (this.player1?.health ?? 0), {
            fontFamily: 'Arial Black',
            fontSize: 20,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setScrollFactor(0);

        this.player1ScoreText = this.add.text(10, 40, 'Player 1 Score: ' + (this.player1?.score ?? 0), {
            fontFamily: 'Arial Black',
            fontSize: 20,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setScrollFactor(0);

        this.player2HealthText = this.add.text(600, 10, 'Player 2 HP: ' + (this.player2?.health ?? 0), {
            fontFamily: 'Arial Black',
            fontSize: 20,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setScrollFactor(0);

        this.player2ScoreText = this.add.text(600, 40, 'Player 2 Score: ' + (this.player2?.score ?? 0), {
            fontFamily: 'Arial Black',
            fontSize: 20,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setScrollFactor(0);

        // Create help text
        this.helpText = this.add.text(300, 450, 'Player 1: WASD to move, SPACE to shoot\nPlayer 2: Arrow keys to move, E to shoot', {
            fontFamily: 'Arial Black',
            fontSize: 18,
            color: '#ffff00',
            stroke: '#000000',
            strokeThickness: 4,
            align: 'center'
        }).setScrollFactor(0).setOrigin(0.5);
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

            // Update the background's tile position based on Player 1's movement
            if (this.player1.body) {
                this.background.tilePositionX += this.player1.body.velocity.x * this.game.loop.delta / 1000;
            }

            // Make sure the camera follows Player 1
            this.camera.scrollX = this.player1.x - this.camera.width / 2;
            this.camera.scrollY = this.player1.y - this.camera.height / 2;
            // Update text displays for health and score
            this.player1HealthText.setText('Player 1 HP: ' + this.player1.health);
            this.player1ScoreText.setText('Player 1 Score: ' + this.player1.score);

            this.player2HealthText.setText('Player 2 HP: ' + this.player2.health);
            this.player2ScoreText.setText('Player 2 Score: ' + this.player2.score);

            // Check if any player's health is 0, go to game over
            if (this.player1.health <= 0) {
                this.finalScore = this.player1.score;
                this.scene.start('GameOver', { score: this.finalScore });
            }

            if (this.player2.health <= 0) {
                this.finalScore = this.player2.score;
                this.scene.start('GameOver', { score: this.finalScore });
            }
        }
    }
}

export default Game;
