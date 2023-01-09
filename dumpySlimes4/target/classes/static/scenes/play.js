class Play extends Phaser.Scene
{
    constructor()
    {
        super({key: 'Play', active: false});
    }

    init(data)
    {
        this.CONFIG = this.sys.game.CONFIG;

        this.music = this.sound.add('gameplay');
        this.music.loop = true;
        this.music.play();
        this.music.setVolume(0.5);

        // Los siguientes datos empiezan siendo 0 si se llega desde Menu o Winner, y si se llega desde Score llega la puntuación hasta la última ronda
        this.playerOneScore = data.playerOneScore;// Almacena la puntuación del primer jugador entre escenas
        this.playerTwoScore = data.playerTwoScore;// Almacena la puntuación del segundo jugador entre escenas
        this.connected = false;

        this.powerupExe = new PowerupExe(this);

        let that = this;

        this.controlled = {

            id : -1,
            player : null,
            gameId : 0
        
        }

        this.functions = {
    
            setPlayer : function (message){
        
                that.controlled.player = message.name;
                that.controlled.id = message.id;
                that.controlled.gameId = message.id_p;
                that.assign();
            },
        
            update : function (message){
                
                let player;
                if(message.name == "slime1")
                {
                    player = that.player1;
                }
                else if (message.name == "slime2")
                {
                    player = that.player2;
                }
    
                player.setVelocityX(message.spdX);
                player.setVelocityY(message.spdY);
                player.setPosition(message.posX, message.posY);
                player.state = message.state;
                player.setTexture(message.texture);

                player.jumpIcon1.setPosition(player.x - 400 * player.size, player.y - 400 * player.size);
                player.jumpIcon2.setPosition(player.x + 400 * player.size, player.y - 400 * player.size);
                if(player.jumps > 0)
                {
                    player.jumpIcon1.setTexture('burbujaVerde');
                }
                else
                {
                    player.jumpIcon1.setTexture('none');
                }
                if(player.jumps == 2)
                {
                    player.jumpIcon2.setTexture('burbujaVerde');
                }
                else
                {
                    player.jumpIcon2.setTexture('none');
                }
                // Intangible
                player.mist.setPosition(player.x, player.y);
                if(player.state == 'intangible')
                {
                    player.mist.setTexture('niebla');
                }
                else
                {
                    player.mist.setTexture('none');
                }
                // Confusión
                player.confusion.setPosition(player.x, player.y - 800 * player.size);
                if(player.confused)
                {
                    player.confusion.setTexture('interrogación');
                }
                else
                {
                    player.confusion.setTexture('none');
                }
                // Helado
                player.ice.setPosition(player.x, player.y);
                if(player.state == 'freeze')
                {
                    player.ice.setTexture('frozenEffect');
                }
                else
                {
                    player.ice.setTexture('none');
                }
            },

            freeze : function (message){
                let player;
                if(message.name == "slime1")
                {
                    player = that.player2;
                }
                else if (message.name == "slime2")
                {
                    player = that.player1;
                }
                that.powerupExe.freeze(player, player);
            },

            confusion : function (message){
                let player;
                if(message.name == "slime1")
                {
                    player = that.player2;
                }
                else if (message.name == "slime2")
                {
                    player = that.player1;
                }
                that.powerupExe.confusion(player, player);
            },

            expansiveWave : function (message){
                let player;
                let target;
                if(message.name == "slime1")
                {
                    player = that.player1;
                    target = that.player2;
                }
                else if (message.name == "slime2")
                {
                    player = that.player2;
                    target = that.player1;
                }
                that.powerupExe.expansiveWave(player, target);
            }
        };

        this.connection = new WebSocket('ws://'+ window.location.host +'/echo');

        this.connection.onerror = function(e) {
            console.log("WS error: " + e);
        }
        
        this.connection.onmessage = function(msg) {
    
            var message = JSON.parse(msg.data);
            if (message.id != that.controlled.id)
            {
                //console.log("WS message: " + msg.data);
                that.functions[message.funcion](message);
            }
        
        }
        
        this.connection.onclose = function() {
        
            console.log("Closing socket");
        }
    }

    create()
    {
        // Creación de grupos...
        //...de jugadores
        this.players = this.add.group({
            classType: Player,
            maxSize: 2,
            runChildUpdate: false
        });/*
        //...de proyectiles de hielo
        this.freezeProyectiles = this.add.group({
            classType: FreezeProyectile,
            maxSize: 1000,
            runChildUpdate: true
        });
        //...de bombas
        this.bombs = this.add.group({
            classType: BombTrap,
            maxSize: 1000,
            runChildUpdate: true
        });
        //...de misiles
        this.missiles = this.add.group({
            classType: Missile,
            maxSize: 1000,
            runChildUpdate: true
        });*/
        //...de burbujas de powerups
        this.bubbles = this.add.group({
            classType: PowerupBubble,
            maxSize: 1000,
            runChildUpdate: true
        });

        // Creación del nivel...
        //...obtención de los arrays de plataformas y objetos
        this.levelGenerator = new LevelGenerator(this);
        let level = this.levelGenerator.generateLevel();
        let platformArray = level.platforms;
        let objectArray = level.objects;
        //...creación de las plataformas
        const map = this.make.tilemap({data:platformArray, tileWidth:128, tileHeight:128});
        const tileset = map.addTilesetImage('tilemap', 'tiles');
        let scalingFactor = this.CONFIG.gameWidth / (tileset.tileWidth * (platformArray[0].length)); // Factor por el que hay que escalar el mapa para que se ajuste al tamaño de la ventana de juego
        let ground = map.createLayer('layer', tileset).setScale(scalingFactor); // Capa con las plataformas
        map.setCollisionBetween(0, 2);
        this.physics.world.TILE_BIAS = 32;
        //...altura y anchura del nivel
        this.levelHeight = platformArray.length * (map.tileHeight * scalingFactor); // Altura del nivel
        this.blockHeight = 24 * map.tileHeight * scalingFactor; // Anchura del nivel
        //...creación de los objetos
        for(let i = 0; i < objectArray.length; i++)
        {
            for(let j = 0; j < objectArray[0].length; j++)
            {
                switch(objectArray[i][j])
                {
                    case 0:
                        this.goal = new Goal(this, j * (map.tileHeight * scalingFactor), i * (map.tileHeight * scalingFactor), this.players);
                        break;
                }
            }
        }

        // Divisor de pantallas
        //this.divisor = this.add.rectangle(this.CONFIG.width * 0.5, this.levelHeight * 0.5, 60, this.levelHeight, 0xF74780);

        // Fondo
        let imgHeight = this.textures.get('fondoNivel').getSourceImage().height;
        for(let i = 0; i * imgHeight < this.levelHeight; i++)
        {
            this.add.image(0, i * imgHeight, 'fondoNivel').setOrigin(0, 0).setDepth(-10);
        }

        // Creación de los controles que se asignarán a cada jugador
        let keys = Phaser.Input.Keyboard.KeyCodes;
        let wasd = this.input.keyboard.addKeys({'up': keys.W, 'down': keys.S, 'left': keys.A, 'right': keys.D, 'power': keys.SPACE});
        let cursors = this.input.keyboard.addKeys({'up': keys.UP, 'down': keys.DOWN, 'left': keys.LEFT, 'right': keys.RIGHT, 'power': keys.NUMPAD_ZERO});

        // Creación de los jugadores
        this.player1 = new Player(this, this.CONFIG.gameWidth * 0.25, this.levelHeight - 100, 'izquierdaSueloAzul', this.players, ground, wasd, 0);
        this.player2 = new Player(this, this.CONFIG.gameWidth * 0.75, this.levelHeight - 100, 'derechaSueloRosa', this.players, ground, wasd, 1);

        // Creación de cámaras...
        //...límites del mundo de juego
        this.physics.world.setBounds(0, 0, this.CONFIG.gameWidth, this.levelHeight);
        //...creación y configuración del tamaño de las cámaras
        this.cameras.main.setSize(this.CONFIG.width, this.CONFIG.height);
        this.cameras.main.setPosition(this.CONFIG.gameWidth * 0.5 + 30, 0);
        //this.camera2 = this.cameras.add(this.CONFIG.width - this.CONFIG.gameWidth, 0, this.CONFIG.width, this.CONFIG.height);
        //...límites de las cámaras
        this.cameras.main.setBounds(0, 0, this.CONFIG.gameWidth, this.levelHeight);
        //this.camera2.setBounds(0, 0, this.CONFIG.gameWidth, this.levelHeight);
        //...seguimiento de jugadores
        //this.cameras.main.startFollow(this.player1, true, 0.05, 0.05);
        //this.camera2.startFollow(this.player2, true, 0.05, 0.05);
        //...fade in al llegar de otra escena
        for(let i = 0; i < this.cameras.cameras.length; i++)
        {
            this.cameras.cameras[0].fadeIn(500, 0, 0, 0);
        }

        // Creación de la interfaz
        this.powerupUI = new PowerupUI(this, 0, 0, this.player1, this.player2);
        this.positionUI = new PositionUI(this, this.CONFIG.gameWidth * 0.97, 0, this.player1, this.player2);

        //Creación de la lógica de las burbujas de powerups
        this.bubbleEvent = this.time.addEvent({ delay: 6000, callback: this.createBubbles, callbackScope: this, loop: true, startAt: 6000 });

        // Creación de la cuenta atrás de 3 a 0
        this.input.keyboard.enabled = false;// Se desactivan los controles hasta que llega a 0
        this.countdown = 3;
        this.text = this.add.bitmapText(
            this.CONFIG.gameWidth * 0.5, 
            this.levelHeight - this.CONFIG.height * 0.5,
            'click',
            'esperando a jugador',
            64
        ).setOrigin(0.5);
        this.timedEvent = undefined;
        this.playertext = this.add.bitmapText(
            this.CONFIG.gameWidth * 0.5, 
            this.levelHeight - this.CONFIG.height * 0.6,
            'click',
            'a',
            32
        ).setOrigin(0.5);
        //this.playertext.setScrollFactor(0,0);
        this.playertext.setOrigin(0, 0);
        this.playertext.setScrollFactor(0,0);
    }

    onEvent() // Lógica de la cuenta atrás
    {
        this.countdown--;
        if(this.countdown == 0)
        {
            this.input.keyboard.enabled = true;
        }
        if(this.countdown == -1)
        {
            this.text.destroy();
            this.timedEvent.remove(false);
            return;
        }
        this.text.text = this.countdown.toString();
    }

    createBubbles() // Crea las burbujas de powerups
    {
        for(let i = 1; i <= this.levelGenerator.levelSize; i++)
        {
            if(i % 2 == 0)
            {
                this.bubbles.add(new PowerupBubble(this, 0, (this.blockHeight * i) - (this.blockHeight * 0.5), this.players, 1));
            }
            else
            {
                this.bubbles.add(new PowerupBubble(this, 720, (this.blockHeight * i) - (this.blockHeight * 0.5), this.players, -1));
            }
        }
    }

    update(time, delta)
    {
        let that = this;

        if(this.controlled.player != null)
        {
            if(this.connected != true)
            {
                this.getGame(this.controlled.gameId, function (size){
                    if (size == 2)
                    {
                        if(that.timedEvent != undefined)
                        {
                            that.timedEvent.remove(false);
                        }
                        that.connected = true;
                        that.text.text = that.countdown.toString();
                        that.timedEvent = that.time.addEvent({ delay: 1000, callback: that.onEvent, callbackScope: that, loop: true });
                    }
                });
            }

            let name;
            if(this.controlled.player == this.player1)
            {
                name = "slime1";
                this.player1.update(time, delta, true);
                this.player2.update(time, delta, false);
            }
            else if (this.controlled.player == this.player2)
            {
                name = "slime2";
                this.player1.update(time, delta, false);
                this.player2.update(time, delta, true);
            }
            
            let update = {
                    
                name : name,
                id : that.controlled.id,
                id_p : that.controlled.gameId,
                posX : that.controlled.player.x,
                posY : that.controlled.player.y,
                spdX : that.controlled.player.body.velocity.x,
                spdY : that.controlled.player.body.velocity.y,
                state : that.controlled.player.state,
                texture : that.controlled.player.texture.key,
                destruir : false

            }
            
            try{

                this.connection.send(JSON.stringify(update));

            }catch(e){

                console.log(e);

            }
        }

        let playerArray = this.players.getChildren().slice(0);
        let player;
        let index;
        let position = 1;
        while(playerArray.length > 0)
        {
            player = playerArray[0];
            index = 0;
            for(let i = 1; i < playerArray.length; i++)
            {
                if(playerArray[i].y < player.y)
                {
                    player = playerArray[i];
                    index = i;
                }
            }
            player.position = position;
            position++;
            playerArray.splice(index, 1);
        }
    }

    assign()
    {
        if (this.controlled.player == "slime1")
        {
            this.controlled.player = this.player1;
            this.player2.setGravityY(0);
            console.log("Manejado: " + "slime1");
            this.cameras.main.startFollow(this.player1, true, 0.05, 0.05);
            //this.camera2.startFollow(this.player2, true, 0.05, 0.05);
            this.playertext.text = 'Eres el jugador azul';
        }
        else if (this.controlled.player == "slime2")
        {
            this.controlled.player = this.player2;
            this.player1.setGravityY(0);
            console.log("Manejado: " + "slime2");
            this.cameras.main.startFollow(this.player2, true, 0.05, 0.05);
            //this.camera2.startFollow(this.player1, true, 0.05, 0.05);
            this.playertext.text = 'Eres el jugador rosa';
        }
        else
        {
            console.log("Manejado: " + "none");
        }
    }

    endRound(player)
    {
        let name;
        let that = this;
        if(this.controlled.player == this.player1)
        {
            name = "slime1";
        }
        else if (this.controlled.player == this.player2)
        {
            name = "slime2";
        }
        
        let update = {
                
            name : name,
            id : that.controlled.id,
            id_p : that.controlled.gameId,
            posX : this.goal.x,
            posY : this.goal.y,
            spdX : 0,
            spdY : 0,
            state : that.controlled.player.state,
            texture : that.controlled.player.texture.key,
            destruir : false

        }
        
        try{

            this.connection.send(JSON.stringify(update));

        }catch(e){

            console.log(e);

        }

        var endConnection = {
                    
            destruir : true,
            id : this.controlled.id,
            id_p: this.controlled.gameId
           
        }
        this.connection.send(JSON.stringify(endConnection));

        this.game.sound.stopAll();
        this.scene.start('Winner', {winner: 'Jugador ' + (player.id + 1)});
    }

    getGame(id, callback) {
        $.ajax({
            method: 'GET',
            url: 'http://' + window.location.host + '/games/' + id
        }).done(function (size) {
            console.log("Game players: " + JSON.stringify(size));
            callback(size);
        })
    }
}