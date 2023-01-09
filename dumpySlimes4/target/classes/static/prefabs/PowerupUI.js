class PowerupUI extends Phaser.GameObjects.Image {
    constructor(scene, x, y, player1, player2) 
    {
        // Constructor del padre
        super(scene, x, y, 'interfaz');

        // Atributos...
        //...para la configuración en la escena
        this.size = 0.07; // Tamaño al que se escala el sprite
        //...generales
        this.player1 = player1;
        this.player2 = player2;
        this.scene = scene;

        // Configuración en la escena
        scene.sys.displayList.add(this);
        this.setScale(this.size);
        this.setOrigin(0, 0);
        this.setScrollFactor(0,0);

        // Iconos de powerups
        this.leftIcon = scene.add.image(this.width * this.scaleX * 0.25, this.height * this.scaleY * 0.5, 'none').setScale(0.15).setScrollFactor(0,0);
        this.rightIcon = scene.add.image(this.width * this.scaleX * 0.75, this.height * this.scaleY * 0.5, 'none').setScale(0.15).setScrollFactor(0,0);

        // Renderizado de distintos powerups en cada cámara
        const originalRenderWebGL = this.renderWebGL;

        this.renderWebGL = function(renderer, src, camera, parentMatrix){
            let player;
            if(this.scene.controlled.player == this.player1)
            {
                player = this.player1;
            }
            else
            {
                player = this.player2;
            }
            switch(player.powerups[0])
            {
                case undefined:
                    this.leftIcon.setTexture('none');
                    break;
                case 'rocket':
                    this.leftIcon.setTexture('iconoCohete');
                    break;
                case 'intangible':
                    this.leftIcon.setTexture('iconoIntangible');
                    break;
                case 'doubleJump':
                    this.leftIcon.setTexture('iconoDobleSalto');
                    break;
                case 'freeze':
                    this.leftIcon.setTexture('iconoHelado');
                    break;
                case 'thief':
                    this.leftIcon.setTexture('iconoLadron');
                    break;
                case 'confusion':
                    this.leftIcon.setTexture('iconoConfusion');
                    break;
                case 'bombTrap':
                    this.leftIcon.setTexture('iconoTrampaBomba');
                    break;
                case 'misile':
                    this.leftIcon.setTexture('iconoMisil');
                    break;
                case 'expansiveWave':
                    this.leftIcon.setTexture('iconoOndaExpansiva');
                    break;
            }
            switch(player.powerups[1])
            {
                case undefined:
                    this.rightIcon.setTexture('none');
                    break;
                case 'rocket':
                    this.rightIcon.setTexture('iconoCohete');
                    break;
                case 'intangible':
                    this.rightIcon.setTexture('iconoIntangible');
                    break;
                case 'doubleJump':
                    this.rightIcon.setTexture('iconoDobleSalto');
                    break;
                case 'freeze':
                    this.rightIcon.setTexture('iconoHelado');
                    break;
                case 'thief':
                    this.rightIcon.setTexture('iconoLadron');
                    break;
                case 'confusion':
                    this.rightIcon.setTexture('iconoConfusion');
                    break;
                case 'bombTrap':
                    this.rightIcon.setTexture('iconoTrampaBomba');
                    break;
                case 'missile':
                    this.rightIcon.setTexture('iconoMisil');
                    break;
                case 'expansiveWave':
                    this.rightIcon.setTexture('iconoOndaExpansiva');
                    break;
            }

            originalRenderWebGL.call(this, renderer, src, camera, parentMatrix);
        };
    }
}