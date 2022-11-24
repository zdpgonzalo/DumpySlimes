class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, sprite, players, ground, controls) 
    {
        //Constructor del padre
        super(scene, x, y, sprite);

        //Atributos...
        //...para la configuración en la escena
        this.size = 2;//Tamaño al que se escala el sprite
        this.bounceX = 0.8;//Fuerza horizontal de rebote al chocar con las plataformas
        this.bounceY = 0.8;//Fuerza vertical de rebote al chocar con las plataformas
        this.gravity = 600 * this.size;//Gravedad por defecto del jugador
        //...para el funcionamiento de los powerups
        this.state = 'normal';//Estado, se usa para cambiar los controles al usar powerups como cohete o confusión
        this.powerups = [];//Almacena los powerups
        this.maxPowerups = 2;//Máximo de powerups almacenados
        this.powerupExe = new PowerupExe(this);//Clase que se usa para ejecutar los powerups, es para tener el código separado
        this.rocketSpeed = this.speed * 3;
        this.rocketMaxMovementSpeed = this.maxMovementSpeed * 1.5;
        this.rocketDrag = this.drag * 5;
        //...para configurar los controles y el movimiento
        this.controls = controls;//Inputs de los controles
        this.speed = 0.5 * this.size;//Velocidad de aceleración al moverse
        this.maxMovementSpeed = 125 * this.size;//Velocidad máxima al moverse
        this.maxBounceSpeed = this.maxMovementSpeed * 2;//Velocidad máxima al rebotar con otro jugador
        this.drag = 0.04 * this.size;//Fuerza de rozamiento en el eje x
        this.maxJumps = 1;//Saltos máximos consecutivos
        this.jumps = 1;//Saltos disponibles en cada momento
        this.jumpTimer;//Controla el tiempo que dura el salto
        this.jumpForce = -250 * this.size;//Fuerza del salto
        this.jumpDuration = 800;//Máxima duración que el jugador puede mantener presionada la tecla de salto para saltar más alto
        this.jumpGravityReductionFactor = 0.5;//Número por el que se modifica la gravedad al mantener pulsado el botón de salto
        this.bouncePlayer = 2.5;//Fuerza de rebote al chocar con otros jugadores, afecta a este jugador y no a los otros
        //...referencias a elementos de la escena
        this.group = players;//Grupo de la escena al que pertenece el jugador
        this.ground = ground;//Capa que almacena las plataformas

        //Configuración en la escena
        scene.sys.updateList.add(this);
        scene.sys.displayList.add(this);
        scene.physics.add.existing(this);
        this.setScale(this.size);
        this.refreshBody();
        this.setCircle(12);
        this.setBounce(this.bounceX, this.bounceY);
        this.setCollideWorldBounds(true);
        this.body.setGravityY(this.gravity);
        players.add(this);

        //Colliders...
        //...entre jugadores
        this.playerCollider = scene.physics.add.collider(this, this.group, function(player1, player2) {
            //Este código es para que los jugadores reboten más entre ellos y que pùedan saltar de nuevo tras hacerlo, y resetea el salto
            player1.setVelocityX(Math.min(player1.body.velocity.x * player1.bouncePlayer, player1.maxBounceSpeed));
            player1.setVelocityY(Math.min(player1.body.velocity.y * player1.bouncePlayer, player1.maxBounceSpeed));
            player1.jumps = player1.maxJumps;
            player1.body.setGravityY(player1.gravity);
            player2.setVelocityX(Math.min(player2.body.velocity.x * player2.bouncePlayer, player2.maxBounceSpeed));
            player2.setVelocityY(Math.min(player2.body.velocity.y * player2.bouncePlayer, player2.maxBounceSpeed));
            player2.jumps = player2.maxJumps;
            player2.body.setGravityY(player2.gravity);
        });
        //...entre el jugador y las plataformas
        this.groundCollider = scene.physics.add.collider(this, ground, function(player, ground) {
            if(player.body.touching.up)
            {
                player.body.setGravityY(player.gravity);
            }
        });
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
                        this.body.velocity.x += -(this.drag * delta);
                    } 
                    else 
                    {
                        this.body.velocity.x += this.drag * delta;
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
                    if (this.body.velocity.x > -(this.maxMovementSpeed))
                    {
                        this.body.velocity.x += -(this.speed * delta);
                    }
                }
                if(this.controls.right.isDown)
                {
                    if (this.body.velocity.x < this.maxMovementSpeed)
                    {
                        this.body.velocity.x += this.speed * delta;
                    }
                }

                //Acelerar la caida
                if(this.controls.down.isDown)
                {
                    if (this.body.velocity.y < this.maxMovementSpeed)
                    {
                        this.body.velocity.y += this.speed * delta;
                    }
                }

                //Salto
                if(Phaser.Input.Keyboard.JustDown(this.controls.up) && this.jumps > 0)
                {
                    this.jumps--;
                    this.setVelocityY(this.jumpForce);
                    this.body.setGravityY(this.gravity * this.jumpGravityReductionFactor);
                    this.jumpTimer = time;
                }
                if(Phaser.Input.Keyboard.JustUp(this.controls.up) || (time - this.jumpTimer) > this.jumpDuration || this.body.velocity.y > 0)
                {
                    this.body.setGravityY(this.gravity);
                }

                //Usar powerup
                if(Phaser.Input.Keyboard.JustDown(this.controls.power) && this.powerups.length != 0)
                {
                    this.usePowerup();
                }

                break;
            case 'rocket': //Movimiento al usar el cohete
                //Rozamiento
                if (this.body.velocity.x != 0)
                {
                    if (this.body.velocity.x > 0)
                    {
                        this.body.velocity.x += -(this.rocketDrag * delta);
                    } 
                    else 
                    {
                        this.body.velocity.x += this.rocketDrag * delta;
                    }
                }

                //Movimiento izquierda-derecha
                if(this.controls.left.isDown)
                {
                    if (this.body.velocity.x > -(this.rocketMaxMovementSpeed))
                    {
                        this.body.velocity.x += -(this.rocketSpeed * delta);
                    }
                }
                if(this.controls.right.isDown)
                {
                    if (this.body.velocity.x < this.rocketMaxMovementSpeed)
                    {
                        this.body.velocity.x += this.rocketSpeed * delta;
                    }
                }

                break;
            case 'intangible'://Igual que normal
                //Rozamiento
                if (this.body.velocity.x != 0)
                {
                    if (this.body.velocity.x > 0)
                    {
                        this.body.velocity.x += -(this.drag * delta);
                    } 
                    else 
                    {
                        this.body.velocity.x += this.drag * delta;
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
                    if (this.body.velocity.x > -(this.maxMovementSpeed))
                    {
                        this.body.velocity.x += -(this.speed * delta);
                    }
                }
                if(this.controls.right.isDown)
                {
                    if (this.body.velocity.x < this.maxMovementSpeed)
                    {
                        this.body.velocity.x += this.speed * delta;
                    }
                }

                //Acelerar la caida
                if(this.controls.down.isDown)
                {
                    if (this.body.velocity.y < this.maxMovementSpeed)
                    {
                        this.body.velocity.y += this.speed * delta;
                    }
                }

                //Salto
                if(Phaser.Input.Keyboard.JustDown(this.controls.up) && this.jumps > 0)
                {
                    this.jumps--;
                    this.setVelocityY(this.jumpForce);
                    this.body.setGravityY(this.gravity * this.jumpGravityReductionFactor);
                    this.jumpTimer = time;
                }
                if(Phaser.Input.Keyboard.JustUp(this.controls.up) || (time - this.jumpTimer) > this.jumpDuration || this.body.velocity.y > 0)
                {
                    this.body.setGravityY(this.gravity);
                }

                //Usar powerup
                if(Phaser.Input.Keyboard.JustDown(this.controls.power) && this.powerups.length != 0)
                {
                    this.usePowerup();
                }

                break;
            case 'freeze': //Movimiento al estar congelado
                //Descongelarse
                if(Phaser.Input.Keyboard.JustDown(this.controls.up))
                {
                    this.powerupExe.breakIce();
                }

                break;
            case 'confusion': //Movimiento al estar confuso, controles invertidos
                //Rozamiento
                if (this.body.velocity.x != 0)
                {
                    if (this.body.velocity.x > 0)
                    {
                        this.body.velocity.x += -(this.drag * delta);
                    } 
                    else 
                    {
                        this.body.velocity.x += this.drag * delta;
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
                    if (this.body.velocity.x > -(this.maxMovementSpeed))
                    {
                        this.body.velocity.x += -(this.speed * delta);
                    }
                }
                if(this.controls.left.isDown)
                {
                    if (this.body.velocity.x < this.maxMovementSpeed)
                    {
                        this.body.velocity.x += this.speed * delta;
                    }
                }

                //Acelerar la caida
                if(this.controls.up.isDown)
                {
                    if (this.body.velocity.y < this.maxMovementSpeed)
                    {
                        this.body.velocity.y += this.speed * delta;
                    }
                }

                //Salto
                if(Phaser.Input.Keyboard.JustDown(this.controls.down) && this.jumps > 0)
                {
                    this.jumps--;
                    this.setVelocityY(this.jumpForce);
                    this.body.setGravityY(this.gravity * this.jumpGravityReductionFactor);
                    this.jumpTimer = time;
                }
                if(Phaser.Input.Keyboard.JustUp(this.controls.down) || (time - this.jumpTimer) > this.jumpDuration || this.body.velocity.y > 0)
                {
                    this.body.setGravityY(this.gravity);
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
                this.powerupExe.rocket(this);
                break;
            case 'intangible':
                this.powerupExe.intangible(this);
                break;
            case 'doubleJump':
                this.powerupExe.doubleJump(this);
                break;
            case 'freeze':
                this.powerupExe.freeze(this);
                break;
            case 'thief':
                this.powerupExe.thief(this);
                break;
            case 'confusion':
                this.powerupExe.confusion(this);
                break;
            case 'bombTrap':
                this.powerupExe.bombTrap(this);
                break;
            case 'misile':
                this.powerupExe.missile(this);
                break;
            case 'expansiveWave':
                this.powerupExe.expansiveWave(this);
                break;
        }
    }
}