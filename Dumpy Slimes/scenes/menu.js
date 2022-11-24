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
        // Título del juego
        this.title = this.add.bitmapText(
            myScene.CONFIG.centerX, 
            150,
            'click',
            'Dumpy Slimes',
            64
        ).setOrigin(0.5);

        // Texto de haz click para jugar
        this.text = this.add.bitmapText(
            myScene.CONFIG.centerX, 
            myScene.CONFIG.centerY,
            'click',
            'Play',
            64
        ).setOrigin(0.5);

        // Crear input del Ratón
        this.createMouseInput();

        // Crear input del Teclado
        this.createKeyboardInput();

        // Cambio de escena cuando se completa el fade out en goPlay
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.scene.start('Play');
        })
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
        this.cameras.main.fadeOut(500, 0, 0, 0);
    }
}