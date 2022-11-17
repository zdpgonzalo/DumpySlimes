class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, sprite, group) 
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
        group.add(this);

        //Atributos
        this.activePowerup = 'none'; 
        this.powerups = this.add.group({
            classType: Powerup,
            maxSize: 2,
            runChildUpdate: true
        });

        this.key = this.input.keyboard.addKeys("SPACE, ENTER");
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

        if((this.key.SPACE.isDown || this.key.ENTER.isDown) && this.powerups.getLength() != 0)
        {
            this.usePowerup();
        }
    }

    usePowerup()
    {
        var powerup = this.powerups.get();

        powerup.use(this);
        this.powerups.remove(powerup);
    }
}