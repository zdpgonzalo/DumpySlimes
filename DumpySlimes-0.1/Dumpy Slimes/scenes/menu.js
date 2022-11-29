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
        // Logo del juego
        this.add.image(this.CONFIG.centerX, this.CONFIG.centerY * 0.6, 'logo').setScale(0.5);

        // Botones
        this.newGame = this.add.sprite(this.CONFIG.centerX, this.CONFIG.centerY * 1.25, 'newGameButton').setInteractive().setScale(0.5);
        this.settings = this.add.sprite(this.CONFIG.centerX, this.CONFIG.centerY * 1.45, 'settingsButton').setInteractive().setScale(0.5);
        let that = this;
        this.newGame.on('pointerdown', function () {

            this.setTexture('newGameButtonDark')
            that.goPlay();
        });
        this.settings.on('pointerdown', function () {

            this.setTexture('settingsButtonDark');
        });

        // Cambio de escena cuando se completa el fade out en goPlay
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.scene.start('Play', {playerOneScore: 0, playerTwoScore: 0});// Empieza la partida con las puntuaciones a 0
        })
    }

    goPlay()
    {
        this.cameras.main.fadeOut(500, 0, 0, 0);
    }
}