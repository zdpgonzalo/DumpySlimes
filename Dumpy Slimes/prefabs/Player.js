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
        this.activePowerup = 'none'; 
        this.powerups = [];
        this.maxPowerups = 2;
        this.bounceForce = 2.5;
        this.controls = controls;
        this.maxSpeed = 600;
        this.maxJumps = 1;
        this.jumps = 1;
        this.key = scene.input.keyboard.addKeys("SPACE, ENTER");
        this.scene = scene;

        //Colliders
        this.playerCollider = scene.physics.add.collider(this, players, function(player1, player2) {
            player1.setVelocityX(Math.min(player1.body.velocity.x * player1.bounceForce, player1.maxSpeed));
            player1.setVelocityY(Math.min(player1.body.velocity.y * player1.bounceForce, player1.maxSpeed));
            player1.jumps = player1.maxJumps;
            player2.setVelocityX(Math.min(player2.body.velocity.x * player2.bounceForce, player2.maxSpeed));
            player2.setVelocityY(Math.min(player2.body.velocity.y * player2.bounceForce, player2.maxSpeed));
            player2.jumps = player2.maxJumps;
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
            this.jumps = this.maxJumps;
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
        if(Phaser.Input.Keyboard.JustDown(this.controls.up) && this.jumps > 0)
        {
            this.jumps--;
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
        this.powerups.splice(0, 1);

        switch(powerup)
        {
            case 'rocket':
                this.rocket();
                break;
            case 'intangible':
                this.intangible();
                break;
            case 'doubleJump':
                this.doubleJump();
                break;
            case 'freeze':
                this.freeze();
                break;
        }
    }

    rocket()
    {
        this.activePowerup = 'rocket';
        this.body.setAllowGravity(false);
        this.setVelocityX(0);
        this.setVelocityY(-500);
        this.groundCollider.active = false;
        this.setCollideWorldBounds(false);
        this.bounceForce = 0;
        //this.setTexture('Rocket');
        let aux = this;
        setTimeout(function()
        { 
            aux.activePowerup = 'none';
            aux.body.setAllowGravity(true);
            aux.groundCollider.active = true;
            aux.setCollideWorldBounds(true);
            aux.bounceForce = 2.5;
        }, 5000);
    }

    intangible()
    {
        this.activePowerup = 'intangible';
        this.playerCollider.active = false;
        let aux = this;
        setTimeout(function()
        { 
            aux.activePowerup = 'none';
            aux.playerCollider.active = true;
        }, 5000);
    }

    doubleJump()
    {
        this.activePowerup = 'doubleJump';
        this.maxJumps = 2;
        this.jumps = 2;
        let aux = this;
        setTimeout(function()
        { 
            aux.activePowerup = 'none';
            aux.maxJumps = 1;
            aux.jumps = Math.min(aux.jumps, 1);
        }, 5000);
    }

    freeze()
    {
        let currentScene = Phaser.Scenes.SceneManager.getScenes(true);

    }
}