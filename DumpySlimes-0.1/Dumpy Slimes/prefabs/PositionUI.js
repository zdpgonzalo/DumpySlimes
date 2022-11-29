class PositionUI extends Phaser.GameObjects.BitmapText {
    constructor(scene, x, y, player1, player2) 
    {
        //Constructor del padre
        super(scene, x, y, 'click');

        //Atributos...
        //...para la configuración en la escena
        this.size = 64;//Tamaño al que se escala el sprite
        //...generales
        this.player1 = player1;
        this.player2 = player2;

        //Configuración en la escena
        scene.sys.displayList.add(this);
        this.setFontSize(this.size);
        this.setOrigin(1, 0);
        this.setScrollFactor(0,0);

        const originalRenderWebGL = this.renderWebGL;

        this.renderWebGL = function(renderer, src, camera, parentMatrix){
            if(camera.id == 1)
            {
                this.setText(player1.position.toString() + 'º');
            }
            else
            {
                this.setText(player2.position.toString() + 'º');
            }

            originalRenderWebGL.call(this, renderer, src, camera, parentMatrix);
        };
    }
}