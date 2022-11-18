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
        players.add(this);

        //Atributos
        this.canJump = true;
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
        //Rozamiento
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

        //Checkeo de si el slime ha tocado el suelo. en cuyo caso puede volver a saltar
        if (this.body.onFloor())
        {
            this.canJump = true;
        }

        //Movimiento izquierda-derecha
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

        //Acelerar la caida
        if(this.controls.down.isDown)
        {
            if (this.body.velocity.y < 300)
            {
                this.body.velocity.y += 1 * delta;
            }
        }

        //Salto
        if(Phaser.Input.Keyboard.JustDown(this.controls.up) && this.canJump)
        {
            this.canJump = false;
            this.setVelocityY(-600);
        }

        //Usar powerup
        if(this.key.SPACE.isDown && this.powerups.length != 0)
        {
            this.usePowerup();
        }
    }

    grabPowerup(id)
    {
        this.powerups.push(id);
    }

    usePowerup()
    {
        var powerup = this.powerups[0];

        switch(powerup)
        {
            case 'rocket':
                //this.powerups.splice(0, 1);
                this.rocket(this);
                break;
        }
    }

    rocket(player)
    {
        player.activePowerup = 'rocket';
        player.body.setAllowGravity(false);
        player.setVelocityX(0);
        player.setVelocityY(-500);
        player.groundCollider.active = false;
        player.setCollideWorldBounds(false);
        player.bounceForce = 0;
        //Player.setTexture('Rocket');
        setTimeout(function()
        { 
            player.activePowerup = 'none';
            player.body.setAllowGravity(true);
            player.groundCollider.active = true;
            player.setCollideWorldBounds(true);
            player.bounceForce = 2.5;
        }, 5000);
    }
}