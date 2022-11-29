class Winner extends Phaser.Scene
{
    constructor()
    {
        super({key: 'Winner', active: false});
    }

    init(data)
    {
        this.CONFIG = this.sys.game.CONFIG;
        this.winner = data.winner; // Ganador de la partida
    }

    preload()
    {
        
    }

    create()
    {
        //Texto del ganador
        this.title = this.add.bitmapText(
            this.CONFIG.centerX, 
            this.CONFIG.centerY,
            'click',
            this.winner.toString() + ' is the winner!',
            64
        ).setOrigin(0.5);

        //Texto de revancha
        this.title = this.add.bitmapText(
            this.CONFIG.centerX, 
            this.CONFIG.centerY + 200,
            'click',
            'Click for rematch',
            48
        ).setOrigin(0.5);

        // Crear input del Ratón
        this.createMouseInput();

        // Cambio de escena cuando se completa el fade out en goPlay
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.scene.start('Play', {playerOneScore: 0, playerTwoScore: 0});// Revancha
        })
    }

    createMouseInput()
    {
        this.input.on('pointerup', this.goPlay, this);
    }

    goPlay()
    {
        this.cameras.main.fadeOut(500, 0, 0, 0);
    }
}