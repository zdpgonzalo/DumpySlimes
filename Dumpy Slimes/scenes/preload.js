class Preload extends Phaser.Scene
{
    constructor()
    {
        super({key: 'Preload', active: false});
    }

    init()
    {
        this.CONFIG = this.sys.game.CONFIG;
    }

    preload()
    {
        // Crear una Barra de Carga
        this.createLoadingBar();

        // Spritesheets
        // Ruta
        this.load.setPath('assets');
        // Sprites
        this.load.image('tiles', 'tilesheets/sheet.png');
        this.load.image('star', 'sprites/star.png');
        // Mapas
        this.load.json('cima', 'tilemaps/cima.json');
        this.load.json('tilemap1', 'tilemaps/tilemap1.json');
        this.load.json('tilemap2', 'tilemaps/tilemap2.json');
        this.load.json('base', 'tilemaps/base.json');
    }

    create()
    {
        // Ir al menu
        this.time.addEvent({
            delay: 500,
            callback: () => {this.scene.start('Menu');},
            callBackScope: this
        });
    }

    createLoadingBar()
    {
        let myScene = this;
        // Título
        this.title = this.add.bitmapText(
            myScene.CONFIG.centerX, 
            175,
            'click',
            'Loading Game',
            32
        ).setOrigin(0.5);

        // Texto de Carga
        this.txt_progress = this.add.bitmapText(
            myScene.CONFIG.centerX, 
            myScene.CONFIG.centerY - 20,
            'click',
            'Loading...',
            32
        ).setOrigin(0.5);

        // Barra de Carga
        let x = 10;
        let y = this.CONFIG.centerY + 5;
        
        this.progress = this.add.graphics({x: x, y: y});
        this.border = this.add.graphics({x: x, y: y});

        // La Barra de Carga se actualiza cada vez que se carga un Archivo en Preload
        this.load.on('progress', this.onProgress, this);
    }

    onProgress(val)
    {
        // Ancho de la Barra de Carga
        let w = this.CONFIG.width - 2*this.progress.x;
        let h = 36;

        // Relleno de la Barra de Carga
        this.progress.clear();
        this.progress.fillStyle('0xFFFFFF', 1);
        this.progress.fillRect(0, 0, w * val, h);

        // Borde de la Barra de Carga
        this.border.clear();
        this.border.lineStyle(2, '0x4D6592', 1);
        this.border.strokeRect(0, 0, w * val, h);

        // Porcentaje de Carga que se muestra en el Texto de Carga
        this.txt_progress.setText(Math.round(val * 100) + '%');
    }
}