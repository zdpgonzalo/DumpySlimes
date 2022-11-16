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
        //Bitmap para la fuente de texto de la escena preload...
        //...ruta
        this.load.setPath('assets/fonts');
        //...archivos
        this.load.bitmapFont('click', 'click.png', 'click.xml');
    }

    create()
    {
        this.scene.start('Preload');
    }
}