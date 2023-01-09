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
        // Bitmap para la fuente de texto de la escena preload
        // Ruta
        this.load.setPath('assets');
        this.load.image('fondoPreload', 'sprites/backgrounds/Fondo_Lobby.png');
        // Archivos
        this.load.bitmapFont('click', 'fonts/click.png', 'fonts/click.xml');
    }

    create()
    {
        this.scene.start('Preload');
    }
}