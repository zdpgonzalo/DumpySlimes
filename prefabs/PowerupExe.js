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
        //Confusion
        this.confusionTime = 8000;//Duración
        //Missile
        this.missileTime = 4000;//Duración del lanzamiento
        //ExpansiveWave
        this.expansiveWaveTime = 4000;//Duración del lanzamiento
        //Fuerza de los lanzamientos
        this.launchedForce = 1000;//Fuerza de la onda expansiva
        this.intangibletimer;
        this.launchTimer;
        this.doubleJumpTimer;
        this.confusionTimer;
    }

    update(time, delta)//Comprueba el estado del jugador, y según este ejecuta cierto código
    {
        switch(this.player.state)
        {
            case 'rocket':
                this.player.setVelocityY(this.rocketSpeed);
                break;
        }
    }

    rocket(player) //convierte al slime en un cohete que asciende a gran velocidad atravesando plataformas y golpeando a jugadores, y que el jugador puede mover de izquierda a derecha
    {
        player.state = 'rocket';
        player.alpha = 1;
        player.body.setGravityY(0);
        player.setVelocityX(0);
        player.setBounce(0);
        player.groundCollider.active = false;
        player.setImmovable(true);

        clearTimeout(this.intangibleTimer);
        setTimeout(function()
        { 
            player.state = 'normal';
            player.body.setGravityY(player.gravity);
            player.groundCollider.active = true;
            player.setBounce(player.bounceX, player.bounceY);
            player.setImmovable(false);
        }, this.rocketTime);
    }

    intangible(player) //hace que el slime no colisione con otros jugadores y que no pueda ser afectado por sus powerups
    {
        player.state = 'intangible';
        player.alpha = 0.5;
        player.mist.setTexture('niebla');

        clearTimeout(this.intangibleTimer);
        this.timer = setTimeout(function()
        { 
            player.state = 'normal';
            player.alpha = 1;
        }, this.intangibleTime);
    }

    doubleJump(player) //otorga doble salto durante un tiempo
    {
        player.maxJumps = 2;
        player.jumps = 2;
        clearTimeout(this.doubleJumpTimer);
        this.doubleJumpTimer = setTimeout(function()
        { 
            player.maxJumps = 1;
            player.jumps = Math.min(player.jumps, 1);
        }, this.doubleJumpTime);
    }

    freeze(player) //congela al jugador en pantalla que esté más alto
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
            if(target.powerups.length > 0 && (target.state != 'intangible' && target.state != 'rocket'))
            {
                powerup = target.powerups[0];
                target.powerups.splice(0, 1);
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
                player.scene.tweens.add({
                    targets: [thief, item],
                    y: { value: '-=200', duration: 2000, ease: 'Power2' },
                    alpha: { value: 0, duration: 2200, ease: 'Power2' }
                });
                player.grabPowerup(powerup);
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
            if(playerList[i].state != 'rocket' && playerList[i].state != 'intangible' && playerList[i].state != 'launched')
            {
                playerList[i].state = 'confusion';
                playerList[i].confusion.setTexture('interrogación');
            }
        }

        clearTimeout(this.confusionTimer);
        this.confusionTimer = setTimeout(function()
        { 
            for(let i = 0; i < playerList.length; i++)
            {
                if(playerList[i].state == 'confusion')
                {
                    playerList[i].state = 'normal';
                }
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
            if(distance <= 900)
            {
                target.powerupExe.launched(target, player, this.expansiveWaveTime);
            }
        }
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

    launched(player, source, launchedTime)
    {
        
        let x = player.x - source.x;
        let y = player.y - source.y;
        let direction = new Phaser.Math.Vector2(x, y).normalize();
        player.setVelocityX(this.launchedForce * direction.x);
        player.setVelocityY(this.launchedForce * direction.y);
        player.body.setGravityY(0);
        player.setBounce(1);
        player.state = 'launched'

        clearTimeout(this.launchTimer);
        this.launchTimer = setTimeout(function()
        {
            player.body.setGravityY(player.gravity);
            player.setBounce(player.bounceX, player.bounceY);
            player.state = 'normal'
        }, launchedTime);
    }

    filterList(player) //Filtra el grupo de jugadores que tiene la escena y devuelve un array con los hijos que son distintos al player recibido
    {
        let filteredList = [];
        let playerList = player.group.getChildren();
        for(let i = 0; i < playerList.length; i++)
        {
            if(playerList[i] != player && playerList[i].state != 'intangible')
            {
                filteredList.push(playerList[i]);
            }
        }
        return filteredList;
    }
}