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
        this.music = this.sound.add('clasificacion');
        this.music.play();
        this.music.setVolume(0.7);
    }

    preload()
    {
        
    }

    create()
    {
        let slime;
        this.add.image(this.CONFIG.centerX, this.CONFIG.centerY, 'fondoRanking').setScale(1);
        if(this.winner == 'Jugador 1')
        {
            this.add.image(this.CONFIG.centerX, this.CONFIG.centerY, 'izquierdaSueloAzul').setScale(0.15);
            slime = 'azul';
        }
        else
        {
            this.add.image(this.CONFIG.centerX, this.CONFIG.centerY, 'izquierdaSueloRosa').setScale(0.15);
            slime = 'rosa';
        }
        //Texto del ganador
        this.title = this.add.bitmapText(
            this.CONFIG.centerX, 
            this.CONFIG.centerY * 0.5,
            'click',
            'El jugador ' + slime.toString() + ' ha ganado!',
            64
        ).setOrigin(0.5);

        this.backMenu = this.add.sprite(this.CONFIG.centerX, this.CONFIG.centerY * 1.5, 'menuButton').setInteractive().setScale(0.5);

        let that = this;
        this.backMenu.on('pointerdown', function () {

            this.setTexture('menuButtonDark');
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