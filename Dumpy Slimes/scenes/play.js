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
            maxSize: 4,
            runChildUpdate: true
        });
        //...de bombas
        this.bombs = this.add.group({
            classType: BombTrap,
            maxSize: 100,
            runChildUpdate: true
        });
        //...de misiles
        this.missiles = this.add.group({
            classType: Missile,
            maxSize: 100,
            runChildUpdate: true
        });

        // Creación del nivel...
        //...obtención de los arrays de plataformas y objetos
        let levelGenerator = new LevelGenerator(this);
        let level = levelGenerator.generateLevel();
        let platformArray = level.platforms;
        let objectArray = level.objects;
        //...creación de las platafromas
        const map = this.make.tilemap({data:platformArray, tileWidth:128, tileHeight:128}); //128
        const tileset = map.addTilesetImage('tilemap', 'tiles');
        let scalingFactor = (this.CONFIG.gameWidth) / (tileset.tileWidth * (platformArray[0].length)); // Factor por el que hay que escalar el mapa para que se ajuste al tamaño de la ventana de juego
        let ground = map.createLayer('layer', tileset).setScale(scalingFactor);
        map.setCollisionBetween(0, 97);
        this.physics.world.TILE_BIAS = 32;
        this.levelHeight = platformArray.length * (map.tileHeight * scalingFactor);// Altura del nivel
        //...creación de los objetos
        for(let i = 0; i < objectArray.length; i++)
        {
            for(let j = 0; j < objectArray[0].length; j++)
            {
                switch(objectArray[i][j])
                {
                    case 0:
                        this.goal = new Goal(this, j * (map.tileHeight * scalingFactor), i * (map.tileHeight * scalingFactor), 'star', this.players);
                        break;
                }
            }
        }

        // Divisor de pantallas
        this.divisor = this.add.rectangle(this.CONFIG.width * 0.5, this.levelHeight * 0.5, 60, this.levelHeight, 0xF74780);

        // Creación de los controles que se asignarán a cada jugador
        let keys = Phaser.Input.Keyboard.KeyCodes;
        let wasd = this.input.keyboard.addKeys({'up': keys.W, 'down': keys.S, 'left': keys.A, 'right': keys.D, 'power': keys.SPACE});
        let cursors = this.input.keyboard.addKeys({'up': keys.UP, 'down': keys.DOWN, 'left': keys.LEFT, 'right': keys.RIGHT, 'power': keys.ENTER});

        // Creación de los jugadores
        this.player1 = new Player(this, 200, this.levelHeight - 150, 'star', this.players, ground, wasd, '01');
        this.player2 = new Player(this, 600, this.levelHeight - 150, 'star', this.players, ground, cursors, '02');

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

    update(time, delta)
    {

    }
}