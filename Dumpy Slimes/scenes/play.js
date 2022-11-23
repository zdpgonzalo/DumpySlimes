class Play extends Phaser.Scene
{
    constructor()
    {
        super({key: 'Play', active: false});
    }

    init()
    {
        this.CONFIG = this.sys.game.CONFIG;
    }

    create()
    {
        //Creación del nivel
        let levelGenerator = new LevelGenerator(this);
        //let array = levelGenerator.generateLevel();
        let array = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2],
            [0, 0, 2, 2, 0, 0, 0, 0, 2, 2, 0, 0],
            [2, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 2],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
            [17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17]
        ];

        //let json = this.cache.json.get('tilemap1');
        //let arrayFixed = this.jsonToMatrix(json);

        let arrayFixed = levelGenerator.generateLevel();

        const map = this.make.tilemap({data:arrayFixed, tileWidth:70, tileHeight:70});
        const tileset = map.addTilesetImage('sheet', 'tiles');
        let scalingFactor = (this.CONFIG.width * 0.5) / (tileset.tileWidth * (arrayFixed[0].length));
        let ground = map.createLayer('layer', tileset).setScale(scalingFactor);
        map.setCollisionBetween(0, 97);
        this.physics.world.TILE_BIAS = 32;

        //Creación de grupos
        this.players = this.add.group({
            classType: Player,
            maxSize: 4,
            runChildUpdate: true
        });

        this.bombs = this.add.group({
            classType: BombTrap,
            maxSize: 100,
            runChildUpdate: true
        });

        this.missiles = this.add.group({
            classType: Missile,
            maxSize: 100,
            runChildUpdate: true
        });

        //Creación de los controles que se asignarán a cada jugador
        let keys = Phaser.Input.Keyboard.KeyCodes;
        let wasd = this.input.keyboard.addKeys({'up': keys.W, 'down': keys.S, 'left': keys.A, 'right': keys.D, 'power': keys.SPACE});
        let cursors = this.input.keyboard.addKeys({'up': keys.UP, 'down': keys.DOWN, 'left': keys.LEFT, 'right': keys.RIGHT, 'power': keys.ENTER});

        //Creación de los jugadores
        this.player1 = new Player(this, 100, 450, 'star', this.players, ground, wasd);
        this.player2 = new Player(this, 700, 450, 'star', this.players, ground, cursors);

        //Testeo, es provisional
        this.powerup = new PowerupBubble(this, 400, 100, 'star', this.players, 'bombTrap');
        this.player2.powerups.push('rocket');

        //Creación de cámaras
        this.physics.world.setBounds(0, 0, this.CONFIG.width * 0.5, arrayFixed.length * (map.tileHeight * scalingFactor));
        
        this.cameras.main.setBounds(0, 0, this.CONFIG.width * 0.5, arrayFixed.length * (map.tileHeight * scalingFactor));

        const camera2 = this.cameras.add(this.CONFIG.width * 0.5, 0, this.CONFIG.width * 0.5, arrayFixed.length * (map.tileHeight * scalingFactor));
        camera2.setBounds(0, 0, this.CONFIG.width * 0.5, arrayFixed.length * (map.tileHeight * scalingFactor));
        
        this.cameras.main.startFollow(this.player1, true, 0.05, 0.05);
        camera2.startFollow(this.player2, true, 0.05, 0.05);
    }

    update(time, delta)
    {

    }

    jsonToMatrix(json)
    {
        let width = json.layers[0].width;
        let array = json.layers[0].data;
        let out = [];
        let row = [];

        for (let i = 0; i < array.length; i++) {
            row.push(array[i]);
            if(row.length == width)
            {
                out.push(row.slice(0));
                row = [];
            }
        }

        for (let y = 0; y < out.length; y++) {
            for (let x = 0; x < width; x++) {
                out[y][x] = out[y][x] - 1;
            }
        }
        
        return out;
    }
}