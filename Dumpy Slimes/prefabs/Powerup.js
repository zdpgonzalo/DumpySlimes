class Powerup extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, sprite, players, id)
    {
        super(scene, x, y, sprite);
        scene.sys.updateList.add(this);
        scene.sys.displayList.add(this);
        scene.physics.add.existing(this);
        this.setScale(1.25);
        this.refreshBody();
        this.setCircle(6);
        this.setCollideWorldBounds(true);
        this.setBounce(1);
        this.setVelocityX(-100);
        this.setVelocityY(100);
        this.body.setAllowGravity(false);
        this.id = id;

        //Colliders
        this.playerOverlap = scene.physics.add.overlap(this, players, function(powerup, player) {
            player.grabPowerup(powerup.id);
            powerup.destroy();
        });
    }
}