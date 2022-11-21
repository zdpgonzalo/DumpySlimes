class PowerupExe { //Clase auxiliar, solo sirve para separar el código
    constructor(player)
    {
        this.player = player;
    }

    rocket()
    {
        this.player.state = 'rocket';
        this.player.body.setAllowGravity(false);
        this.player.setVelocityX(0);
        this.player.setVelocityY(-100);
        this.player.groundCollider.active = false;
        this.player.setCollideWorldBounds(false);
        this.player.bounceForce = 0;
        //player.setTexture('Rocket');
        let playerAux = this.player;
        setTimeout(function()
        { 
            playerAux.state = 'normal';
            playerAux.body.setAllowGravity(true);
            playerAux.groundCollider.active = true;
            playerAux.setCollideWorldBounds(true);
            playerAux.bounceForce = 2.5;
        }, 5000);
    }

    intangible()
    {
        this.player.playerCollider.active = false;
        let playerAux = this.player;
        setTimeout(function()
        { 
            playerAux.playerCollider.active = true;
        }, 5000);
    }

    doubleJump()
    {
        this.player.maxJumps = 2;
        this.player.jumps = 2;
        let playerAux = this.player;
        setTimeout(function()
        { 
            playerAux.maxJumps = 1;
            playerAux.jumps = Math.min(playerAux.jumps, 1);
        }, 5000);
    }

    freeze()
    {
        let playerList = this.filterList(this.player);

        let target = playerList[0];
        for(let i = 0; i < playerList.length; i++)
        {
            if(playerList[i].y < target.y)
            {
                target = playerList[i];
            }
        }

        target.state = 'freeze';
        target.stun = 10;
        target.body.setAllowGravity(false);
        target.setVelocityX(0);
        target.setVelocityY(0);
    }

    thief()
    {
        let playerList = this.filterList(this.player);
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

    confusion()
    {
        let playerList = this.filterList(this.player);
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
        }, 5000);
    }

    bombTrap()
    {
        //crear una instancia de BombTrap en la posición del jugador y pasarle el jugador que la ha desplegado
        //el resto del código está en la clase de BombTrap
    }

    misile()
    {
        //crear una instancia de Missile en la posición del jugador y pasarle el jugador que va en primera posición
        //el resto del código está en la clase de Misil
    }

    expansiveWave()
    {
        let playerList = this.filterList(this.player);
        //para cada jugador
            //calcular su vector entre el jugador que ha usado el powerup y este jugador
            //normalizarlo para saber la magnitud de x e y
            //aplicar cierta velocidad en cada eje multiplicada por las magnitudes
            //cambiar el estado a launched
        //lanzar un temporizador para volver a los jugadores al estado normal
            //función con el bucle donde se hace
    }

    //Filtra el grupo de jugadores que tiene la escena y devuelve un array con los hijos que son distintos al player recibido
    filterList(player)
    {
        let filteredList = [];
        let playerList = player.players.getChildren();
        for(let i = 0; i < playerList.length; i++)
        {
            if(playerList[i] != player)
            {
                filteredList.push(playerList[i]);
            }
        }
        return filteredList;
    }
}