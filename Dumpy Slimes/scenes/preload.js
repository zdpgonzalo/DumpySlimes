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

        // Assets
        // Ruta
        this.load.setPath('assets');
        // Tilesheets
        this.load.image('tiles', 'tilesheets/Tilemap.png');
        // Sprites
        this.load.image('star', 'sprites/star.png');
        this.load.image('logo', 'sprites/logo.png');
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
        // Título
        this.title = this.add.bitmapText(
            this.CONFIG.centerX, 
            this.CONFIG.centerX * 0.5,
            'click',
            'Loading Game',
            64
        ).setOrigin(0.5);

        // Texto de Carga
        this.txt_progress = this.add.bitmapText(
            this.CONFIG.centerX, 
            this.CONFIG.centerY,
            'click',
            'Loading...',
            48
        ).setOrigin(0.5);

        // Barra de Carga
        let x = this.CONFIG.centerX * 0.25;
        let y = this.CONFIG.centerY * 1.1;
        
        this.progress = this.add.graphics({x: x, y: y});
        this.border = this.add.graphics({x: x, y: y});

        // La Barra de Carga se actualiza cada vez que se carga un Archivo en Preload
        this.load.on('progress', this.onProgress, this);
    }

    onProgress(val)
    {
        // Ancho de la Barra de Carga
        let w = this.CONFIG.width - 2 * this.progress.x;
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