class PowerupExe { //Clase auxiliar, solo sirve para separar el código
    constructor(player)
    {
        //Atributos
        this.player = player;//Almacena el jugador al que hace referencia
        //Rocket
        this.rocketSpeed = -300;//Velocidad cuando el jugador está en modo cohete
        this.rocketTime = 4000;//Duración
        this.rocketLaunchTime = 2000;//Duración del lanzamiento
        //Intangible
        this.intangibleTime = 4000;//Duración
        //DoubleJump
        this.doubleJumpTime = 10000;//Duración
        //Freeze
        this.stun = 15;
        //Thief
        this.thiefSound = player.scene.sound.add('ladron');
        //Confusion
        this.confusionTime = 8000;//Duración
        //Missile
        this.missileTime = 4000;//Duración del lanzamiento
        //ExpansiveWave
        this.expansiveWaveTime = 4000;//Duración del lanzamiento
        this.expansiveWaveSound = player.scene.sound.add('ondaExpansiva');
        //Fuerza de los lanzamientos
        this.launchedForce = 1000;//Fuerza de la onda expansiva
        //Timers
        this.intangibletimer;
        this.doubleJumpTimer;
        this.confusionTimer;
        this.launchTimer;

        // Colliders...
        //...entre el cohete y otro jugador
        this.rocketCollider = player.scene.physics.add.overlap(player, player.group, function(rocket, player) {
            if(target.state != 'rocket' && target.state != 'intangible' && target.state != 'freeze')
            {
                player.powerupExe.launched(player, rocket, player.powerupExe.rocketLaunchTime);
            }
        });
        this.rocketCollider.active = false;
    }

    update(time, delta)//Comprueba el estado del jugador, y según este ejecuta cierto código
    {
        // Intangible
        this.player.mist.setPosition(this.player.x, this.player.y);
        if(this.player.state == 'intangible')
        {
            this.player.mist.setTexture('niebla');
        }
        else
        {
            this.player.mist.setTexture('none');
        }
        // Confusión
        this.player.confusion.setPosition(this.player.x, this.player.y - 800 * this.player.size);
        if(this.player.confused)
        {
            this.player.confusion.setTexture('interrogación');
        }
        else
        {
            this.player.confusion.setTexture('none');
        }
        // Helado
        this.player.ice.setPosition(this.player.x, this.player.y);
        if(this.player.state == 'freeze')
        {
            this.player.ice.setTexture('frozenEffect');
        }
        else
        {
            this.player.ice.setTexture('none');
        }
    }

    rocket(player) //convierte al slime en un cohete que asciende a gran velocidad atravesando plataformas y golpeando a jugadores, y que el jugador puede mover de izquierda a derecha
    {
        this.resetState(player);
        this.changeState(player, 'rocket');

        let that = this;
        setTimeout(function()
        {
            that.resetState(player);
        }, this.rocketTime);
    }

    intangible(player) //hace que el slime no colisione con otros jugadores y que no pueda ser afectado por sus powerups
    {
        this.resetState(player);
        this.changeState(player, 'intangible');

        let that = this;
        this.intangibleTimer = setTimeout(function()
        { 
            that.resetState(player);
        }, this.intangibleTime);
    }

    doubleJump(player) //otorga doble salto durante un tiempo
    {
        this.resetState(player);
        this.changeState(player, 'doubleJump');

        this.doubleJumpTimer = setTimeout(function()
        { 
            player.maxJumps = 1;
            player.jumps = Math.min(player.jumps, 1);
        }, this.doubleJumpTime);
    }

    freeze(player) //lanza un proyectil que congela al jugador en pantalla que esté más alto
    {
        let playerList = this.filterList(player);

        let target = player;
        for(let i = 0; i < playerList.length; i++)
        {
            if(playerList[i].y < target.y)
            {
                target = playerList[i];
            }
        }
        
        if(target != null && target != player)
        {
            player.scene.freezeProyectiles.add(new FreezeProyectile(player, target));
        }
    }

    breakIce(player) //código que maneja que el jugador congelado se descongele
    {
        this.stun--;
        if(this.stun <= 0)
        {
            this.resetState(player);
            this.stun = 15;
        }
    }

    thief(player) //roba un objeto de un jugador aleatorio que tenga al menos uno
    {
        let playerList = this.filterList(player);
        let target;
        let random;
        let powerup;
        while(playerList.length > 0)
        {
            random = Math.floor(Math.random()*playerList.length);
            target = playerList[random];
            if (target.powerups.length > 0 && (target.state != 'intangible' && target.state != 'rocket'))
            {
                powerup = target.powerups[0];
                target.powerups.splice(0, 1);
                player.grabPowerup(powerup);
                let thief = player.scene.physics.add.sprite(target.x, target.y, 'ladrón').setScale(0.2);
                let sprite;
                switch(powerup)
                {
                    case 'rocket':
                        sprite = 'iconoCohete';
                        break;
                    case 'intangible':
                        sprite = 'iconoIntangible';
                        break;
                    case 'doubleJump':
                        sprite = 'iconoDobleSalto';
                        break;
                    case 'freeze':
                        sprite = 'iconoHelado';
                        break;
                    case 'thief':
                        sprite = 'iconoLadron';
                        break;
                    case 'confusion':
                        sprite = 'iconoConfusion';
                        break;
                    case 'bombTrap':
                        sprite = 'iconoTrampaBomba';
                        break;
                    case 'missile':
                        sprite = 'iconoMisil';
                        break;
                    case 'expansiveWave':
                        sprite = 'iconoOndaExpansiva';
                        break;
                }
                let item = player.scene.physics.add.sprite(target.x, target.y + 25, sprite).setScale(0.1);
                this.thiefSound.play();
                player.scene.tweens.add({
                    targets: [thief, item],
                    y: { value: '-=200', duration: 2000, ease: 'Power2' },
                    alpha: { value: 0, duration: 2200, ease: 'Power2' }
                });
                setTimeout(function()
                { 
                    thief.destroy();
                    item.destroy();
                }, 2200);
                return;
            }
            else 
            {
                playerList.splice(random, 1);
            }
        }
    }

    confusion(player) //invierte los controles del resto de jugadores
    {
        let playerList = this.filterList(player);
        for(let i = 0; i < playerList.length; i++)
        {
            if (playerList[i].state != 'rocket' && playerList[i].state != 'intangible')
            {
                playerList[i].confused = true;
            }
        }

        this.confusionTimer = setTimeout(function()
        { 
            for(let i = 0; i < playerList.length; i++)
            {
                playerList[i].confused = false;
            }
        }, this.confusionTime);
    }

    bombTrap(player) //despliega una bomba que detecta si otro jugador se acerca, acelerando hacia este y explotando al chocar con el jugador o una plataforma, lanzándolo por los aires
    {
        player.scene.bombs.add(new BombTrap(player));
    }

    missile(player) //vuela hasta el jugador que está en la primera posición y lo lanza por los aires durante un tiempo
    {
        player.scene.missiles.add(new Missile(player));
    }

    expansiveWave(player) //lanza una onda expansiva que afecta al esto de jugadores en la pantalla y los lanza por los aires
    {
        let playerList = this.filterList(player);
        let x;
        let y;
        let distance;
        let target;
        for(let i = 0; i < playerList.length; i++)
        {
            target = playerList[i];
            x = target.x - player.x;
            y = target.y - player.y;
            distance = new Phaser.Math.Vector2(x, y).length();
            if (distance <= 900 && (target.state != 'rocket' && target.state != 'intangible' && target.state != 'freeze'))
            {
                target.powerupExe.launch(target, player, this.expansiveWaveTime);
            }
        }

        this.expansiveWaveSound.play();
        let explosion = player.scene.physics.add.sprite(player.x, player.y, 'explosion').setScale(5);
        player.scene.tweens.add({
            targets: explosion,
            alpha: { value: 0, duration: 1000, ease: 'Power2' }
        });
        setTimeout(function()
        { 
            explosion.destroy();
        }, this.expansiveWaveTime);
    }

    launch(player, source, launchedTime)
    {
        this.resetState(player);
        this.changeState(player, 'launched');
        let x = player.x - source.x;
        let y = player.y - source.y;
        let direction = new Phaser.Math.Vector2(x, y).normalize();
        player.setVelocityX(this.launchedForce * direction.x);
        player.setVelocityY(this.launchedForce * direction.y);

        clearTimeout(this.launchTimer);
        let that = this;
        this.launchTimer = setTimeout(function()
        {
            that.resetState(player);
        }, launchedTime);
    }

    filterList(player) //Filtra el grupo de jugadores que tiene la escena y devuelve un array con los hijos que son distintos al player recibido
    {
        let filteredList = [];
        let playerList = player.group.getChildren();
        for(let i = 0; i < playerList.length; i++)
        {
            if (playerList[i] != player && playerList[i].state != 'intangible')
            {
                filteredList.push(playerList[i]);
            }
        }
        return filteredList;
    }

    resetState(player)
    {
        player.state = 'normal';
        player.body.setGravityY(player.gravity);
        player.setBounce(player.bounceX, player.bounceY);
        player.groundCollider.active = true;
        player.setImmovable(false);
        this.rocketCollider.active = false;
        player.alpha = 1;
        clearTimeout(this.intangibleTimer);
        player.maxJumps = 1;
        player.jumps = Math.min(player.jumps, 1);
        clearTimeout(this.doubleJumpTimer);
        clearTimeout(this.confusionTimer);
    }

    changeState(player, state)
    {
        switch(state)
        {
            case 'rocket':
                player.state = 'rocket';
                player.body.setGravityY(0);
                player.setVelocityX(0);
                player.setBounce(0);
                player.groundCollider.active = false;
                player.setImmovable(true);
                player.setVelocityY(this.rocketSpeed);
                this.rocketCollider.active = true;
                break;
            case 'intangible':
                player.state = 'intangible';
                player.alpha = 0.5;
                break;
            case 'doubleJump':
                player.state = 'doubleJump';
                player.maxJumps = 2;
                player.jumps = 2;
                break;
            case 'freeze':
                player.state = 'freeze';
                player.body.setGravityY(0);
                player.setVelocityX(0);
                player.setVelocityY(0);
                player.setBounce(0);
                player.setImmovable(true);
                break;
            case 'launched':
                player.state = 'launched';
                player.body.setGravityY(0);
                player.setBounce(1);
                break;
        }
    }
}