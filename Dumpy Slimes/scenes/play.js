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
        let myScene = this;
        //Game tittle
        this.title = this.add.bitmapText(
            myScene.CONFIG.centerX, 
            150,
            'click',
            'Dumpy Slimes',
            64
        ).setOrigin(0.5);
    }
}