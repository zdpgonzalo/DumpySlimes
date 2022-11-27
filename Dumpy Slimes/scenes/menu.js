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
        // Título del juego
        this.add.image(this.CONFIG.centerX, this.CONFIG.centerY * 0.75, 'logo').setScale(0.5);

        // Texto de haz click para jugar
        this.text = this.add.bitmapText(
            this.CONFIG.centerX, 
            this.CONFIG.centerY * 1.5,
            'click',
            'Haz Click Para Jugar',
            64
        ).setOrigin(0.5);

        // Crear input del Ratón
        this.createMouseInput();

        // Crear input del Teclado
        this.createKeyboardInput();

        // Cambio de escena cuando se completa el fade out en goPlay
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.scene.start('Play', {playerOneScore: 0, playerTwoScore: 0});// Empieza la partida con las puntuaciones a 0
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