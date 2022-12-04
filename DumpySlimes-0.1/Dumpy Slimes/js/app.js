const App = function()
{
    'use strict';

    this.VERSION = '0.0.1';
    this.IS_DEV = true;
};

App.prototype.start = function()
{
    'use strict';

    // Escenas, hay que modificarlo cada vez que se crea una Nueva Escena
    let scenes = [];

    scenes.push(Boot);
    scenes.push(Preload);
    scenes.push(Menu);
    scenes.push(Play);
    scenes.push(Score);
    scenes.push(Winner);

    // Game config
    const config = {
        type: Phaser.AUTO,
        parent: 'phaser-app',
        title: 'Dumpy Slimes',
        width: 1500,
        height: 1280,
        scene: scenes,
        backgroundColor: '0xFFC1D5',
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 },
                debug: true,
                fps: 60
            }
        },
        plugins: {
            scene: [
                {
                    key: 'PhaserRaycaster',
                    plugin: PhaserRaycaster,
                    mapping: 'raycasterPlugin'
                }
            ]
        }
    };

    // Crear Game app
    let game = new Phaser.Game(config);

    // Globales
    game.IS_DEV = this.IS_DEV;
    game.VERSION = this.VERSION;

    // Propiedades de la Configuración del Juego a las que deben acceder las Escenas
    game.CONFIG = {
        width: config.width,
        height: config.height,
        bridge: 60,
        gameWidth: (config.width - 60) / 2,
        centerX: Math.round(0.5*config.width),
        centerY: Math.round(0.5*config.height),
        tile: 32
    }

    // Sonido
    game.sound_on = true;
}