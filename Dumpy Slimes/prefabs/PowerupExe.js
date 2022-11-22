class PowerupExe { //Clase auxiliar, solo sirve para separar el código
    constructor(player)
    {
        //Atributos
        this.player = player;//Almacena el jugador al que hace referencia
        //Rocket
        this.rocketSpeed = -100;//Velocidad cuando el jugador está en modo cohete
        this.rocketTime = 5000;//Duración
        //Intangible
        this.intangibleTime = 5000;//Duración
        //DoubleJump
        this.doubleJumpTime = 10000;//Duración
        //Freeze
        this.maxStun = 10;//Veces que hay que pulsar la tecla de salto para descongelarse
        this.stun = 0;//Contador para descongelarse
        //Confusion
        this.confusionTime = 10000;//Duración
        //ExpansiveWave
        this.expansionWaveForce = 1000;//Fuerza de la onda expansiva
        this.expansionWaveTime = 2000;//Duración del lanzamiento
    }

    update(time, delta)//Comprueba el estado del jugador, y según este ejecuta cierto código
    {
        switch(this.player.state)
        {
            case 'rocket':
                this.player.setVelocityY(this.rocketSpeed);
                break;
            case 'freeze':
                this.player.setVelocityX(0);
                this.player.setVelocityY(0);
                break;
        }
    }

    rocket(player) //convierte al slime en un cohete que asciende a gran velocidad atravesando plataformas y golpeando a jugadores, y que el jugador puede mover de izquierda a derecha
    {
        player.state = 'rocket';
        player.body.setGravityY(0);
        player.setVelocityX(0);
        player.setVelocityY(this.rocketSpeed);
        player.groundCollider.active = false;
        player.setBounce(0);
        setTimeout(function()
        { 
            player.state = 'normal';
            player.body.setGravityY(player.gravity);
            player.groundCollider.active = true;
            player.setBounce(this.player.bounceGround);
        }, this.rocketTime);
    }

    intangible(player) //hace que el slime no colisione con otros jugadores y que no pueda ser afectado por sus powerups
    {
        player.state = 'intangible';
        player.playerCollider.active = false;
        setTimeout(function()
        { 
            player.state = 'normal';
            player.playerCollider.active = true;
        }, this.intangibleTime);
    }

    doubleJump(player) //otorga doble salto durante un tiempo
    {
        player.maxJumps = 2;
        player.jumps = 2;
        setTimeout(function()
        { 
            player.maxJumps = 1;
            player.jumps = Math.min(player.jumps, 1);
        }, this.doubleJumpTime);
    }

    freeze(player) //congela al jugador en pantalla que esté más alto
    {
        let playerList = this.filterList(player);

        let target;
        for(let i = 0; i < playerList.length; i++)
        {
            if(playerList[i].y < target.y)
            {
                target = playerList[i];
            }
        }

        if(target != null)
        {
            target.state = 'freeze';
            target.body.setGravityY(0);
            target.setVelocityX(0);
            target.setVelocityY(0);
            this.stun = this.maxStun;
        }
    }

    breakIce(player) //código que maneja que el jugador congelado se descongele
    {
        this.stun--;
        if(this.stun <= 0)
        {
            player.state = 'normal';
            player.enableBody;
            player.body.setGravityY(player.gravity);
        }
    }

    thief(player) //roba un objeto de un jugador aleatorio que tenga al menos uno
    {
        let playerList = this.filterList(player);
        let target;
        let random;
        while(playerList.length > 0)
        {
            random = Math.floor(Math.random()*playerList.length);
            target = playerList[random];
            if(target.powerups.length > 0)
            {
                player.powerups.push(target.powerups[0]);
                target.powerups.splice(0, 1);
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
            playerList[i].state = 'confusion';
        }

        setTimeout(function()
        { 
            for(let i = 0; i < playerList.length; i++)
            {
                playerList[i].state = 'normal';
            }
        }, this.confusionTime);
    }

    bombTrap(player) //despliega una bomba que detecta si otro jugador se acerca, acelerando hacia este y explotando al chocar con el jugador o una plataforma, lanzándolo por los aires
    {
        player.scene.bombs.add(new BombTrap(player, player.ground));
    }

    misile(player) //vuela hasta el jugador que está en la primera posición y lo lanza por los aires durante un tiempo
    {
        player.scene.missiles.add(new Missile(player));
    }

    expansiveWave(player) //lanza una onda expansiva que afecta al esto de jugadores en la pantalla y los lanza por los aires
    {
        let playerList = this.filterList(player);
        let x;
        let y;
        let direction;
        let target;
        for(let i = 0; i < playerList.length; i++)
        {
            target = playerList[i];
            x = target.x - this.player.x;
            y = target.y - this.player.y;
            direction = new Phaser.Math.Vector2(x, y).normalize();
            target.setVelocityX(this.expansionWaveForce * direction.x);
            target.setVelocityY(this.expansionWaveForce * direction.y);
            target.body.setGravityY(0);
            target.setBounce(1);
            target.state = 'launched'
        }

        setTimeout(function()
        { 
            for(let i = 0; i < playerList.length; i++)
            {
                target = playerList[i];
                target.body.setGravityY(target.gravity);
                target.setBounce(target.bounceGround);
                target.state = 'none'
            }
        }, this.expansionWaveTime);
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