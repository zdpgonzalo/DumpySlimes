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

        //Creación de los jugadores
        let players = this.add.group({
            classType: Player,
            maxSize: 4,
            runChildUpdate: true
        });

        this.player1 = new Player(this, 100, 450, 'star', players);
        this.player2 = new Player(this, 700, 450, 'star', players);

        //Configurar controles
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys("W,A,S,D");

        //Colliders
        this.physics.add.collider(players, players, function(player1, player2) {
            player1.setVelocityX(player1.body.velocity.x * 2.5);
            player1.setVelocityY(player1.body.velocity.y * 2.5);
            player1.canJump = true;
            player2.setVelocityX(player2.body.velocity.x * 2.5);
            player2.setVelocityY(player2.body.velocity.y * 2.5);
            player2.canJump = true;
        });

        this.physics.add.collider(players, ground);
    }

    update(time, delta)
    {
        //player1
        if(this.cursors.left.isDown)
        {
            if (this.player1.body.velocity.x > -300)
            {
                this.player1.body.velocity.x += -0.7 * delta;
            }
        }
        if(this.cursors.right.isDown)
        {
            if (this.player1.body.velocity.x < 300)
            {
                this.player1.body.velocity.x += 0.7 * delta;
            }
        }
        if(this.cursors.down.isDown)
        {
            if (this.player1.body.velocity.y < 300)
            {
                this.player1.body.velocity.y += 1 * delta;
            }
        }

        if(Phaser.Input.Keyboard.JustDown(this.cursors.up) && this.player1.canJump)
        {
            this.player1.canJump = false;
            this.player1.setVelocityY(-600);
        }
        
        //player2
        if(this.wasd.A.isDown)
        {
            if (this.player2.body.velocity.x > -300)
            {
                this.player2.body.velocity.x += -0.7 * delta;
            }
        }
        if(this.wasd.D.isDown)
        {
            if (this.player2.body.velocity.x < 300)
            {
                this.player2.body.velocity.x += 0.7 * delta;
            }
        }
        if(this.wasd.S.isDown)
        {
            if (this.player2.body.velocity.y < 300)
            {
                this.player2.body.velocity.y += 1 * delta;
            }
        }

        if(Phaser.Input.Keyboard.JustDown(this.wasd.W) && this.player2.canJump)
        {
            this.player2.canJump = false;
            this.player2.setVelocityY(-600);
        }
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