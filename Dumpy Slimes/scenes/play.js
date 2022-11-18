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

        let arrayFixed = this.tmjToArray(array);
        const map = this.make.tilemap({data:arrayFixed, tileWidth:70, tileHeight:70});
        const tileset = map.addTilesetImage('sheet', 'tiles');
        const ground = map.createLayer('layer', tileset);
        map.setCollisionBetween(0, 97);
        this.physics.world.TILE_BIAS = 32;

        //Creación de los jugadores y sus controles
        this.players = this.add.group({
            classType: Player,
            maxSize: 4,
            runChildUpdate: true
        });

        let keys = Phaser.Input.Keyboard.KeyCodes;
        let wasd = this.input.keyboard.addKeys({'up': keys.UP, 'down': keys.DOWN, 'left': keys.LEFT, 'right': keys.RIGHT});
        let cursors = this.input.keyboard.addKeys({'up': keys.W, 'down': keys.S, 'left': keys.A, 'right': keys.D});

        this.player1 = new Player(this, 100, 450, 'star', this.players, ground, wasd);
        this.player2 = new Player(this, 700, 450, 'star', this.players, ground, cursors);

        this.powerup = new Powerup(this, 400, 100, 'star', this.players, 'rocket');
    }

    update(time, delta)
    {
        
    }

    tmjToArray(array)
    {
        let width = array[0].length;
        let out = Array(array.length);

        for (let i = 0; i < array.length; i++) {
            out[i] = Array(width);
        }

        for (let y = 0; y < array.length; y++) {
            for (let x = 0; x < width; x++) {
                out[y][x] = array[y][x] - 1;
            }
        }
        
        return out;
    }
}