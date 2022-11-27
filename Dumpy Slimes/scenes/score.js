class Score extends Phaser.Scene
{
    constructor()
    {
        super({key: 'Score', active: false});
    }

    init(data)
    {
        this.CONFIG = this.sys.game.CONFIG;

        //Los siguientes datos llegan de los resultados de la última ronda
        this.playerOneScore = data.playerOneScore;// Almacena la puntuación del primer jugador entre escenas
        this.playerTwoScore = data.playerTwoScore;// Almacena la puntuación del segundo jugador entre escenas

        //Comprueba que jugador ha ganado e incrementa su puntuación
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
        // Texto jugador 1
        this.title = this.add.bitmapText(
            this.CONFIG.centerX - 300, 
            this.CONFIG.centerY - 150,
            'click',
            'Player 1',
            64
        ).setOrigin(0.5);
        this.title = this.add.bitmapText(
            this.CONFIG.centerX - 300, 
            this.CONFIG.centerY,
            'click',
            this.playerOneScore.toString() + '/3',
            64
        ).setOrigin(0.5);

        // Texto jugador 2
        this.title = this.add.bitmapText(
            this.CONFIG.centerX + 300, 
            this.CONFIG.centerY - 150,
            'click',
            'Player 2',
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
            if(this.playerOneScore >= 3)// Si gana el jugador 1 se va a la escena Winner con el resultado
            {
                this.scene.start('Winner', {winner: 'Player 1'});
                return;
            }
            if(this.playerTwoScore >= 3)// Si gana el jugador 2 se va a la escena Winner con el resultado
            {
                this.scene.start('Winner', {winner: 'Player 2'});
                return;
            }
            this.scene.start('Play', {playerOneScore: this.playerOneScore, playerTwoScore: this.playerTwoScore});// Siguiente ronda
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