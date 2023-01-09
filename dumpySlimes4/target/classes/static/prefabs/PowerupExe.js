class PowerupExe { //Clase auxiliar, solo sirve para separar el código
    constructor(scene)
    {
        this.scene = scene;
        //Rocket
        this.rocketSpeed = -300;//Velocidad cuando el jugador está en modo cohete
        this.rocketTime = 4000;//Duración
        this.rocketLaunchTime = 2000;//Duración del lanzamiento
        this.rocketSound = this.scene.sound.add('cohete');
        this.rocketSound.setVolume(0.75);
        //Intangible
        this.intangibleTime = 4000;//Duración
        //DoubleJump
        this.doubleJumpTime = 10000;//Duración
        this.doubleJumpSound = this.scene.sound.add('dobleSalto');
        //Freeze
        this.freezeSound = this.scene.sound.add('helado');
        //Thief
        this.thiefSound = this.scene.sound.add('ladron');
        //Confusion
        this.confusionTime = 8000;//Duración
        this.confusionSound = this.scene.sound.add('confusión');
        //Missile
        this.missileTime = 4000;//Duración del lanzamiento
        //ExpansiveWave
        this.expansiveWaveTime = 4000;//Duración del lanzamiento
        this.expansiveWaveSound = this.scene.sound.add('ondaExpansiva');
        //Fuerza de los lanzamientos
        this.launchedForce = 1000;//Fuerza de la onda expansiva
        //Timers
        this.intangibletimer;
        this.doubleJumpTimer;
        this.confusionTimer;
        this.launchTimer;
    }

    update(time, delta)//Comprueba el estado del jugador, y según este ejecuta cierto código
    {
        
    }

    rocket(player, target) //convierte al slime en un cohete que asciende a gran velocidad atravesando plataformas y golpeando a jugadores, y que el jugador puede mover de izquierda a derecha
    {
        this.resetState(player);
        this.rocketSound.play();
        this.changeState(player, 'rocket');

        let that = this;
        setTimeout(function()
        {
            that.rocketSound.stop();
            that.resetState(player);
        }, this.rocketTime);
    }

    intangible(player, target) //hace que el slime no colisione con otros jugadores y que no pueda ser afectado por sus powerups
    {
        this.resetState(player);
        this.thiefSound.play();
        this.changeState(player, 'intangible');

        let that = this;
        this.intangibleTimer = setTimeout(function()
        { 
            that.resetState(player);
        }, this.intangibleTime);
    }

    doubleJump(player, target) //otorga doble salto durante un tiempo
    {
        this.resetState(player);
        this.doubleJumpSound.play();
        this.changeState(player, 'doubleJump');

        this.doubleJumpTimer = setTimeout(function()
        { 
            player.maxJumps = 1;
            player.jumps = Math.min(player.jumps, 1);
        }, this.doubleJumpTime);
    }

    freeze(player, target) //lanza un proyectil que congela al jugador en pantalla que esté más alto
    {
        if(target.state == 'normal' || target.state == 'doubleJump' || target.state == 'freeze' || target.state == 'confusion' || target.state == 'launched')
        {
            this.resetState(target);
            this.freezeSound.play();
            this.changeState(target, 'freeze');
        }
    }

    thief(player, target) //roba un objeto de un jugador aleatorio que tenga al menos uno
    {
        let playerList = this.filterList(player);
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

    confusion(player, target) //invierte los controles del resto de jugadores
    {
        if (target.state != 'rocket' && target.state != 'intangible')
        {
            this.confusionSound.play();
            target.confused = true;
        }

        this.confusionTimer = setTimeout(function()
        { 
            target.confused = false;
        }, this.confusionTime);
    }

    bombTrap(player, target) //despliega una bomba que detecta si otro jugador se acerca, acelerando hacia este y explotando al chocar con el jugador o una plataforma, lanzándolo por los aires
    {
        player.scene.bombs.add(new BombTrap(player));
    }

    missile(player, target) //vuela hasta el jugador que está en la primera posición y lo lanza por los aires durante un tiempo
    {
        player.scene.missiles.add(new Missile(player));
    }

    expansiveWave(player, target) //lanza una onda expansiva que afecta al esto de jugadores en la pantalla y los lanza por los aires
    {
        let x;
        let y;
        let distance;
        
        x = target.x - player.x;
        y = target.y - player.y;
        distance = new Phaser.Math.Vector2(x, y).length();
        if (distance <= 900 && (target.state != 'rocket' && target.state != 'intangible' && target.state != 'freeze'))
        {
            this.launch(target, player, this.expansiveWaveTime);
        }

        this.expansiveWaveSound.play();
        let explosion = this.scene.physics.add.sprite(player.x, player.y, 'explosion').setScale(5);
        this.scene.tweens.add({
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
        this.scene.controlled.player.state = 'normal';
        this.scene.controlled.player.body.setGravityY(player.gravity);
        this.scene.controlled.player.setBounce(player.bounceX, player.bounceY);
        this.scene.controlled.player.groundCollider.active = true;
        this.scene.controlled.player.setImmovable(false);
        this.scene.controlled.player.rocketCollider.active = false;
        this.scene.controlled.player.alpha = 1;
        clearTimeout(this.intangibleTimer);
        this.scene.controlled.player.maxJumps = 1;
        this.scene.controlled.player.jumps = Math.min(player.jumps, 1);
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
                player.rocketCollider.active = true;
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