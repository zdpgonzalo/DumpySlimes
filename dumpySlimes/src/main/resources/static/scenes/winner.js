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

        this.newGame = this.add.sprite(this.CONFIG.centerX, this.CONFIG.centerY * 1.25, 'newGameButton').setInteractive().setScale(0.5);
        this.backMenu = this.add.sprite(this.CONFIG.centerX, this.CONFIG.centerY * 1.5, 'newGameButton').setInteractive().setScale(0.5);

        let that = this;
        this.newGame.on('pointerdown', function () {

            this.setTexture('newGameButtonDark');
            that.goPlay();
        });
        this.backMenu.on('pointerdown', function () {

            this.setTexture('newGameButtonDark');
            that.goMenu();
        });
    }

    goPlay()
    {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.scene.start('Play', {playerOneScore: 0, playerTwoScore: 0});// Empieza la partida con las puntuaciones a 0
        })
    }

    goMenu()
    {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.scene.start('Menu');
        })
    }
}