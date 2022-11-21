class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, sprite, players, ground, controls) 
    {
        //Configuración en la escena
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

        //Atributos generales
        this.state = 'normal';//Estado, se usa para cambiar los controles al usar powerups como cohete o confusión
        this.powerups = [];//Almacena los powerups
        this.maxPowerups = 2;//Máximo de powerups almacenados
        this.powerupExe = new PowerupExe(this);//Clase que se usa para ejecutar los powerups, es para tener el código separado
        this.bounceForce = 2.5;//Fuerza de rebote, afecta a este jugador y no a otros con los que rebota
        this.controls = controls;//Controles
        this.maxSpeed = 600;//Velocidad máxima
        this.maxJumps = 1;//Saltos máximos consecutivos
        this.jumps = 1;//Saltos disponibles en cada momento
        this.group = players;//Grupo al que pertenece
        this.stun = 0;//Se usa para el powerup helado, seguramente sea provisional

        //Colliders...
        //...entre jugadores
        this.playerCollider = scene.physics.add.collider(this, players, function(player1, player2) {
            //Este código es para que los jugadores reboten más entre ellos y que pùedan saltar de nuevo tras hacerlo
            player1.setVelocityX(Math.min(player1.body.velocity.x * player1.bounceForce, player1.maxSpeed));
            player1.setVelocityY(Math.min(player1.body.velocity.y * player1.bounceForce, player1.maxSpeed));
            player1.jumps = player1.maxJumps;
            player2.setVelocityX(Math.min(player2.body.velocity.x * player2.bounceForce, player2.maxSpeed));
            player2.setVelocityY(Math.min(player2.body.velocity.y * player2.bounceForce, player2.maxSpeed));
            player2.jumps = player2.maxJumps;
        });
        //...entre el jugador y las plataformas
        this.groundCollider = scene.physics.add.collider(this, ground);
    }

    update(time, delta)
    {
        //Comprueba el estado del jugador, y según este decide que controles va a tener
        switch(this.state)
        {
            case 'normal': //Movimiento normal
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
                if(Phaser.Input.Keyboard.JustDown(this.controls.power) && this.powerups.length != 0)
                {
                    this.usePowerup();
                }

                break;
            case 'rocket': //Movimiento al usar el cohete
                this.setVelocityY(-100);
                //Rozamiento
                if (this.body.velocity.x != 0)
                {
                    if (this.body.velocity.x > 0)
                    {
                        this.body.velocity.x += -0.5 * delta;
                    } 
                    else 
                    {
                        this.body.velocity.x += 0.5 * delta;
                    }
                }

                //Movimiento izquierda-derecha
                if(this.controls.left.isDown)
                {
                    if (this.body.velocity.x > -400)
                    {
                        this.body.velocity.x += -2 * delta;
                    }
                }
                if(this.controls.right.isDown)
                {
                    if (this.body.velocity.x < 400)
                    {
                        this.body.velocity.x += 2 * delta;
                    }
                }

                break;
            case 'freeze': //Movimiento al estar congelado
                //Descongelarse
                this.setVelocityX(0);
                this.setVelocityY(0);
                if(Phaser.Input.Keyboard.JustDown(this.controls.up))
                {
                    this.powerupExe.breakIce();
                }

                break;
            case 'confusion': //Movimiento al estar confuso
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
                if(this.controls.right.isDown)
                {
                    if (this.body.velocity.x > -300)
                    {
                        this.body.velocity.x += -0.7 * delta;
                    }
                }
                if(this.controls.left.isDown)
                {
                    if (this.body.velocity.x < 300)
                    {
                        this.body.velocity.x += 0.7 * delta;
                    }
                }

                //Acelerar la caida
                if(this.controls.up.isDown)
                {
                    if (this.body.velocity.y < 300)
                    {
                        this.body.velocity.y += 1 * delta;
                    }
                }

                //Salto
                if(Phaser.Input.Keyboard.JustDown(this.controls.down) && this.jumps > 0)
                {
                    this.jumps--;
                    this.setVelocityY(-600);
                }

                //Usar powerup
                if(Phaser.Input.Keyboard.JustDown(this.controls.power) && this.powerups.length != 0)
                {
                    this.usePowerup();
                }

                break;
            case 'launched': //Movimiento al ser lanzado por la trampa bomba, el misil o la onda expansiva
                break;
        }
    }

    grabPowerup(id)//Añade un powerup a la lista de powerups del jugador
    {
        this.powerups.push(id);
    }

    usePowerup()//Usa el primer powerup de la lista de powerups del jugador
    {
        var powerup = this.powerups[0];
        this.powerups.splice(0, 1);

        //Comprueba que powerup ha usado el jugador y ejecuta su método correspondiente en powerupExe
        switch(powerup)
        {
            case 'rocket':
                this.powerupExe.rocket();
                break;
            case 'intangible':
                this.powerupExe.intangible();
                break;
            case 'doubleJump':
                this.powerupExe.doubleJump();
                break;
            case 'freeze':
                this.powerupExe.freeze();
                break;
            case 'thief':
                this.powerupExe.thief();
                break;
            case 'confusion':
                this.powerupExe.confusion();
                break;
            case 'bombTrap':
                this.powerupExe.bombTrap();
                break;
            case 'misile':
                this.powerupExe.missile();
                break;
            case 'expansiveWave':
                this.powerupExe.expansiveWave();
                break;
        }
    }
}