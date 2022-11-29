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
        this.load.json('bloque01', 'tilemaps/bloque01.json');
        this.load.json('bloque02', 'tilemaps/bloque02.json');
        this.load.json('bloque03', 'tilemaps/bloque03.json');
        this.load.json('bloque04', 'tilemaps/bloque04.json');
        this.load.json('bloque05', 'tilemaps/bloque05.json');
        this.load.json('bloque06', 'tilemaps/bloque06.json');
        this.load.json('bloque07', 'tilemaps/bloque07.json');
        this.load.json('bloque08', 'tilemaps/bloque08.json');
        this.load.json('bloque09', 'tilemaps/bloque09.json');
        this.load.json('bloque10', 'tilemaps/bloque10.json');
        this.load.json('bloque11', 'tilemaps/bloque11.json');
        this.load.json('bloque12', 'tilemaps/bloque12.json');
        this.load.json('bloque13', 'tilemaps/bloque13.json');
        this.load.json('bloque14', 'tilemaps/bloque14.json');
        this.load.json('bloque15', 'tilemaps/bloque15.json');
        this.load.json('bloque16', 'tilemaps/bloque16.json');
        this.load.json('bloque17', 'tilemaps/bloque17.json');
        this.load.json('bloque18', 'tilemaps/bloque18.json');
        this.load.json('bloque19', 'tilemaps/bloque19.json');
        this.load.json('bloque20', 'tilemaps/bloque20.json');
        this.load.json('bloque21', 'tilemaps/Bloque21.json');
        this.load.json('bloque22', 'tilemaps/Bloque22.json');
        this.load.json('bloque23', 'tilemaps/Bloque23.json');
        this.load.json('bloque24', 'tilemaps/Bloque24.json');
        this.load.json('bloque25', 'tilemaps/Bloque25.json');
        this.load.json('bloque26', 'tilemaps/Bloque26.json');
        this.load.json('bloque27', 'tilemaps/Bloque27.json');
        this.load.json('bloque28', 'tilemaps/Bloque28.json');
        this.load.json('bloque29', 'tilemaps/Bloque29.json');
        this.load.json('bloque30', 'tilemaps/Bloque30.json');
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
