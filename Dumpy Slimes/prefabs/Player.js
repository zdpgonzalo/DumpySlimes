class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, sprite, players, ground) 
    {
        super(scene, x, y, sprite);
        scene.sys.updateList.add(this);
        scene.sys.displayList.add(this);
        scene.physics.add.existing(this);
        this.setScale(2.5);
        this.refreshBody();
        this.setCircle(12);
        this.setBounce(0.7);
        this.setCollideWorldBounds(true);
        this.canJump = true;
        players.add(this);

        //Atributos
        this.activePowerup = 'none'; 
        this.powerups = [];
        this.maxPowerups = 2;

        this.key = this.input.keyboard.addKeys("SPACE, ENTER");

        //Colliders
        scene.physics.add.collider(this, ground);
    }

    update(time, delta)
    {
        if (this.body.velocity.x != 0)
        {
            if (this.body.velocity.x > 0)
            {
                this.body.velocity.x += -0.1 * delta;
            } 
            else 
            {
                this.body.velocity.x += 0.1 * delta;
            }
        }

        if (this.body.onFloor())
        {
            this.canJump = true;
        }
    }

    usePowerup()
    {
        var powerup = this.powerups[0];

        powerup.use(this);
        this.powerups.splice(0, 1);
    }
}