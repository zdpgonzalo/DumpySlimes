class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, sprite, players, ground, controls) 
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
        this.bounceForce = 2.5;
        this.controls = controls;
        this.maxSpeed = 600;

        this.key = scene.input.keyboard.addKeys("SPACE, ENTER");

        //Colliders
        this.playerCollider = scene.physics.add.collider(this, players, function(player1, player2) {
            player1.setVelocityX(Math.min(player1.body.velocity.x * player1.bounceForce, player1.maxSpeed));
            player1.setVelocityY(Math.min(player1.body.velocity.y * player1.bounceForce, player1.maxSpeed));
            player1.canJump = true;
            player2.setVelocityX(Math.min(player2.body.velocity.x * player2.bounceForce, player2.maxSpeed));
            player2.setVelocityY(Math.min(player2.body.velocity.y * player2.bounceForce, player2.maxSpeed));
            player2.canJump = true;
        });

        this.groundCollider = scene.physics.add.collider(this, ground);
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

        if(this.controls.left.isDown)
        {
            if (this.body.velocity.x > -300)
            {
                this.body.velocity.x += -0.7 * delta;
            }
        }
        if(this.controls.right.isDown)
        {
            if (this.body.velocity.x < 300)
            {
                this.body.velocity.x += 0.7 * delta;
            }
        }
        if(this.controls.down.isDown)
        {
            if (this.body.velocity.y < 300)
            {
                this.body.velocity.y += 1 * delta;
            }
        }

        if(Phaser.Input.Keyboard.JustDown(this.controls.up) && this.canJump)
        {
            this.canJump = false;
            this.setVelocityY(-600);
        }

        if(this.key.SPACE.isDown && this.powerups.getLength() != 0)
        {
            this.usePowerup();
        }
    }

    usePowerup()
    {
        var powerup = this.powerups[0];

        powerup.use(this);
        this.powerups.splice(0, 1);
    }
}