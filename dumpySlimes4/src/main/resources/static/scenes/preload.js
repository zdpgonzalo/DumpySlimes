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
        this.add.image(this.CONFIG.centerX, this.CONFIG.centerY, 'fondoPreload').setScale(1);
        // Crear una Barra de Carga
        this.createLoadingBar();
        // Assets...
        //...ruta
        this.load.setPath('assets');
        //...tilesheets
        this.load.image('tiles', 'tilesheets/Tilemap.png');
        // Sprites...
        //...iconoPowerup
        this.load.image('iconoCohete', 'sprites/iconoPowerup_cohete.png');
        this.load.image('iconoIntangible', 'sprites/iconoPowerup_intangible.png');
        this.load.image('iconoDobleSalto', 'sprites/iconoPowerup_dobleSalto.png');
        this.load.image('iconoHelado', 'sprites/iconoPowerup_helado.png');
        this.load.image('iconoLadron', 'sprites/iconoPowerup_ladron.png');
        this.load.image('iconoConfusion', 'sprites/iconoPowerup_confusion.png');
        this.load.image('iconoTrampaBomba', 'sprites/iconoPowerup_trampaBomba.png');
        this.load.image('iconoMisil', 'sprites/iconoPowerup_misil.png');
        this.load.image('iconoOndaExpansiva', 'sprites/iconoPowerup_ondaExpansiva.png');
        //...objetoNivel
        this.load.image('burbujaDorada', 'sprites/objetoNivel_burbuja.png');
        this.load.image('corona', 'sprites/objetoNivel_corona.png');
        //...efectoJugador
        this.load.image('burbujaVerde', 'sprites/efectoJugador_burbuja.png');
        //...efectoPowerup
        this.load.image('bombaDesactivada', 'sprites/efectoPowerup_bombaDesactivada.png');
        this.load.image('bombaActivada', 'sprites/efectoPowerup_bombaActivada.png');
        //...miscelaneo
        this.load.image('star', 'sprites/star.png');
        this.load.image('logo', 'sprites/logo.png');
        this.load.image('newGameButton', 'sprites/New_Game_Button.png');
        this.load.image('newGameButtonDark', 'sprites/New_Game_Button_Dark.png');
        this.load.image('settingsButton', 'sprites/Settings_Button.png');
        this.load.image('settingsButtonDark', 'sprites/Settings_Button_Dark.png');
        this.load.image('chatButton', 'sprites/Boton_Chat.png');
        this.load.image('chatButtonDark', 'sprites/Boton_ChatPulsado.png');
        this.load.image('menuButton', 'sprites/Boton_Menu.png');
        this.load.image('menuButtonDark', 'sprites/Boton_MenuPulsado.png');
        this.load.image('interfaz', 'sprites/Panel.png');
        this.load.image('frozenEffect', 'sprites/Frozen_Effect.png');
        this.load.image('none', 'sprites/transparentImage.png');
        this.load.image('ladrón', 'sprites/Efecto-Ladrón.png');
        this.load.image('interrogación', 'sprites/EfectoJugador_Confusión.png');
        this.load.image('niebla', 'sprites/Efecto_Intangible.png');
        this.load.image('explosion', 'sprites/Explosion.png');
        //...fondos
        this.load.image('fondoNivel', 'sprites/backgrounds/Fondo_Nivel_Selva.png');
        this.load.image('fondoMenu', 'sprites/backgrounds/Fondo_Inicio.png');
        this.load.image('fondoChat', 'sprites/backgrounds/Fondo_Chat.png');
        this.load.image('fondoRanking', 'sprites/backgrounds/Fondo_Ranking_Selva.png');
        //...sprites jugadores
        this.load.image('derechaSueloRosa', 'sprites/SpritesRosa/spriteJugador_inicioAndarD.png');
        this.load.image('derechaSaltoRosa', 'sprites/SpritesRosa/spriteJugador_arribaD.png');
        this.load.image('derechaCaidaRosa', 'sprites/SpritesRosa/spriteJugador_abajoD.png');
        this.load.image('izquierdaSueloRosa', 'sprites/SpritesRosa/spriteJugador_inicioAndarI.png');
        this.load.image('izquierdaSaltoRosa', 'sprites/SpritesRosa/spriteJugador_arribaI.png');
        this.load.image('izquierdaCaidaRosa', 'sprites/SpritesRosa/spriteJugador_abajoI.png');
        this.load.image('derechaSueloAzul', 'sprites/SpritesAzul/spriteJugador_inicioAndarD.png');
        this.load.image('derechaSaltoAzul', 'sprites/SpritesAzul/spriteJugador_arribaD.png');
        this.load.image('derechaCaidaAzul', 'sprites/SpritesAzul/spriteJugador_abajoD.png');
        this.load.image('izquierdaSueloAzul', 'sprites/SpritesAzul/spriteJugador_inicioAndarI.png');
        this.load.image('izquierdaSaltoAzul', 'sprites/SpritesAzul/spriteJugador_arribaI.png');
        this.load.image('izquierdaCaidaAzul', 'sprites/SpritesAzul/spriteJugador_abajoI.png');
        this.load.image('coheteAzul', 'sprites/SpritesAzul/spriteJugador_cohete.png');
        this.load.image('coheteRosa', 'sprites/SpritesRosa/spriteJugador_cohete.png');
        //...mapas
        this.load.json('cima', 'tilemaps/cima.json');
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
        this.load.json('bloque21', 'tilemaps/bloque21.json');
        this.load.json('bloque22', 'tilemaps/bloque22.json');
        this.load.json('bloque23', 'tilemaps/bloque23.json');
        this.load.json('bloque24', 'tilemaps/bloque24.json');
        this.load.json('bloque25', 'tilemaps/bloque25.json');
        this.load.json('bloque26', 'tilemaps/bloque26.json');
        this.load.json('bloque27', 'tilemaps/bloque27.json');
        this.load.json('bloque28', 'tilemaps/bloque28.json');
        this.load.json('bloque29', 'tilemaps/bloque29.json');
        this.load.json('bloque30', 'tilemaps/bloque30.json');
        this.load.json('base', 'tilemaps/base.json');
        // Sonidos
        //this.load.audio('salto', 'sounds/salto.ogg');
        this.load.audio('salto', 'sounds/cartoon-jump-6462.mp3');
        this.load.audio('ondaExpansiva', 'sounds/OndaExpansiva.ogg');
        this.load.audio('ladron', 'sounds/Robar.ogg');
        this.load.audio('menu', 'sounds/Menu.ogg');
        this.load.audio('gameplay', 'sounds/Gameplay.ogg');
        this.load.audio('burbuja', 'sounds/objeto.ogg');
        this.load.audio('cohete', 'sounds/Cohete.ogg');
        this.load.audio('dobleSalto', 'sounds/salto.ogg');
        this.load.audio('helado', 'sounds/Congelar.ogg');
        this.load.audio('confusión', 'sounds/Confusion.ogg');
        this.load.audio('clasificacion', 'sounds/Clasificacion.ogg');
        // html
        this.load.html('login', 'text/login.html');
        this.load.html('chat', 'text/chat.html');
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