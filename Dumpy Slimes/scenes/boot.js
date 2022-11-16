class Boot extends Phaser.Scene
{
    constructor()
    {
        super({key: 'Boot', active: true});

    }

    init()
    {

    }

    preload()
    {
        //Bitmap font for PreloadScene...
        //...path
        this.load.setPath('assets/fonts');
        //...files
        this.load.bitmapFont('click', 'click.png', 'click.xml');
    }

    create()
    {
        this.scene.start('Preload');
    }
}