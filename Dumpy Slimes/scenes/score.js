class Score extends Phaser.Scene
{
    constructor()
    {
        super({key: 'Score', active: false});
    }

    init(data)
    {
        this.CONFIG = this.sys.game.CONFIG;
        this.playerOneScore = data.playerOneScore;
        this.playerTwoScore = data.playerTwoScore;
        
        switch(data.playerOrder[0])
        {
            case '01':
                this.playerOneScore++;
                break;
            case '02':
                this.playerTwoScore++;
                break;
        }
    }

    preload()
    {
        
    }

    create()
    {
        this.title = this.add.bitmapText(
            this.CONFIG.centerX - 300, 
            this.CONFIG.centerY - 150,
            'click',
            'Player 1',
            64
        ).setOrigin(0.5);
        this.title = this.add.bitmapText(
            this.CONFIG.centerX + 300, 
            this.CONFIG.centerY - 150,
            'click',
            'Player 2',
            64
        ).setOrigin(0.5);

        this.title = this.add.bitmapText(
            this.CONFIG.centerX - 300, 
            this.CONFIG.centerY,
            'click',
            this.playerOneScore.toString() + '/3',
            64
        ).setOrigin(0.5);
        this.title = this.add.bitmapText(
            this.CONFIG.centerX + 300, 
            this.CONFIG.centerY,
            'click',
            this.playerTwoScore.toString() + '/3',
            64
        ).setOrigin(0.5);

        // Crear input del Ratón
        this.createMouseInput();

        // Cambio de escena cuando se completa el fade out en goPlay
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            if(this.playerOneScore >= 3)
            {
                this.scene.start('Winner', {winner: 'Player 1'});
                return;
            }
            if(this.playerTwoScore >= 3)
            {
                this.scene.start('Winner', {winner: 'Player 2'});
                return;
            }
            this.scene.start('Play', {playerOneScore: this.playerOneScore, playerTwoScore: this.playerTwoScore});
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