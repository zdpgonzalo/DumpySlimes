class Play extends Phaser.Scene
{
    constructor()
    {
        super({key: 'Play', active: false});
    }

    init(data)
    {
        this.CONFIG = this.sys.game.CONFIG;

        // Los siguientes datos empiezan siendo 0 si se llega desde Menu o Winner, y si se llega desde Score llega la puntuación hasta la última ronda
        this.playerOneScore = data.playerOneScore;// Almacena la puntuación del primer jugador entre escenas
        this.playerTwoScore = data.playerTwoScore;// Almacena la puntuación del segundo jugador entre escenas
    }

    create()
    {
        // Creación de grupos...
        //...de jugadores
        this.players = this.add.group({
            classType: Player,
            maxSize: 2,
            runChildUpdate: true
        });
        //...de proyectiles de hielo
        this.freezeProyectiles = this.add.group({
            classType: FreezeProyectile,
            maxSize: 1000,
            runChildUpdate: true
        });
        //...de cubos de hielo
        this.freezeCubes = this.add.group({
            classType: FreezeCube,
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
        });
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
        this.divisor = this.add.rectangle(this.CONFIG.width * 0.5, this.levelHeight * 0.5, 60, this.levelHeight, 0xF74780);

        // Fondo
        for(let i = 0; i * 1204 < this.levelHeight; i++)
        {
            this.add.image(0, i * 1204, 'fondo').setOrigin(0, 0).setDepth(-10);
        }

        // Creación de los controles que se asignarán a cada jugador
        let keys = Phaser.Input.Keyboard.KeyCodes;
        let wasd = this.input.keyboard.addKeys({'up': keys.W, 'down': keys.S, 'left': keys.A, 'right': keys.D, 'power': keys.SPACE});
        let cursors = this.input.keyboard.addKeys({'up': keys.UP, 'down': keys.DOWN, 'left': keys.LEFT, 'right': keys.RIGHT, 'power': keys.NUMPAD_ZERO});

        // Creación de los jugadores
        this.player1 = new Player(this, this.CONFIG.gameWidth * 0.25, this.levelHeight - 100, 'derechaSueloRosa', this.players, ground, wasd, '01');
        this.player2 = new Player(this, this.CONFIG.gameWidth * 0.75, this.levelHeight - 100, 'izquierdaSueloAzul', this.players, ground, cursors, '02');

        // Creación de cámaras...
        //...límites del mundo de juego
        this.physics.world.setBounds(0, 0, this.CONFIG.gameWidth, this.levelHeight);
        //...creación y configuración del tamaño de las cámaras
        this.cameras.main.setSize(this.CONFIG.width, this.CONFIG.height);
        const camera2 = this.cameras.add(this.CONFIG.width - this.CONFIG.gameWidth, 0, this.CONFIG.width, this.CONFIG.height);
        //...límites de las cámaras
        this.cameras.main.setBounds(0, 0, this.CONFIG.gameWidth, this.levelHeight);
        camera2.setBounds(0, 0, this.CONFIG.gameWidth, this.levelHeight);
        //...seguimiento de jugadores
        this.cameras.main.startFollow(this.player1, true, 0.05, 0.05);
        camera2.startFollow(this.player2, true, 0.05, 0.05);
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
            this.countdown.toString(),
            64
        ).setOrigin(0.5);
        this.timedEvent = this.time.addEvent({ delay: 1000, callback: this.onEvent, callbackScope: this, loop: true });
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
}