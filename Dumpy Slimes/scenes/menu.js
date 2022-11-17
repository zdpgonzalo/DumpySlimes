class Menu extends Phaser.Scene
{
    constructor()
    {
        super({key: 'Menu', active: false});

    }

    init()
    {
        this.CONFIG = this.sys.game.CONFIG;
    }

    preload()
    {

    }

    create()
    {
        let myScene = this;
        //Título del juego
        this.title = this.add.bitmapText(
            myScene.CONFIG.centerX, 
            150,
            'click',
            'Dumpy Slimes',
            64
        ).setOrigin(0.5);

        //Texto haz click para jugar
        this.text = this.add.bitmapText(
            myScene.CONFIG.centerX, 
            myScene.CONFIG.centerY,
            'click',
            'Play',
            64
        ).setOrigin(0.5);

        //Create mouse input
        this.createMouseInput();

        //Create keyboard input
        this.createKeyboardInput();
    }

    createMouseInput()
    {
        this.input.on('pointerup', this.goPlay, this);
    }

    createKeyboardInput()
    {
        function handleKeyUp(e)
        {
            switch(e.code)
            {
                case 'Enter':
                    this.goPlay();
                    break;
            }
        }

        this.input.keyboard.on('keyup', handleKeyUp, this);
    }

    goPlay()
    {
        this.scene.start('Play');
    }
}