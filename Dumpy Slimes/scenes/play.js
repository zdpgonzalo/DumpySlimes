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
        let players;
        let cursors;
        let wasd;
        
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