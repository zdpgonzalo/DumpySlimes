class Preload extends Phaser.Scene
{
    constructor()
    {
        super({key: 'Preload', active: false});
    }

    init()
    {
        this.URL = this.sys.game.URL;
        this.CONFIG = this.sys.game.CONFIG;
    }

    preload()
    {
        //Create loading bar
        this.createLoadingBar();

        //Spritesheets...
        //...path
        this.load.setPath(this.URL + 'assets/img');
        //...files
        //this.load.spritesheet('name', 'filename', {frameWidth: 16, frameHeight: 16, endFrame: 4, margin: 1, spacing: 2});
    }

    create()
    {
        //Go menu
        this.time.addEvent({
            delay: 1000,
            callback: () => {this.scene.start('Menu');},
            callBackScope: this
        });
    }

    createLoadingBar()
    {
        let myScene = this;
        //Title
        this.title = this.add.bitmapText(
            myScene.CONFIG.centerX, 
            75,
            'click',
            'Loading Game',
            14,
            0.5
        );

        //Progress text
        this.txt_progress = this.add.bitmapText(
            myScene.CONFIG.centerX, 
            myScene.CONFIG.centerY - 5,
            'click',
            'Loading...',
            'preload',
            14,
            {x: 0.5, y: 1}
        );

        //Progress bar
        let x = 10;
        let y = this.CONFIG.centerY + 5;
        
        this.progress = this.add.graphics({x: x, y: y});
        this.border = this.add.graphics({x: x, y: y});

        //Progress callback
        this.load.on('progress', this.onProgress, this);
    }

    onProgress(val)
    {
        //Width of progress bar
        let w = this.CONFIG.width - 2*this.progress.x;
        let h = 36;

        this.progress.clear();
        this.progress.fillStyle('0xFFFFFF', 1);
        this.progress.fillRect(0, 0, w * val, h);

        this.border.clear();
        this.border.lineStyle(2, '0x4D6592', 1);
        this.border.strokeRect(0, 0, w * val, h);

        //Percentage in progress text
        this.txt_progress.setText(Math.round(val * 100) + '%');
    }
}