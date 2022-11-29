class FreezeCube extends Phaser.Physics.Arcade.Sprite {
    constructor(player) 
    {
        //Constructor del padre
        super(player.scene, player.x, player.y, 'frozenEffect');

        //Atributos...
        //...para la configuración en la escena
        this.size = 0.1;//Tamaño al que se escala el sprite
        //...generales
        this.stun = 20;//Número de veces que el jugador debe pesionar la tecla de salto para descongelarse
        this.player = player;//Jugador congelado
        clearTimeout(this.player.powerupExe.launchTimer);
        this.player.state = 'freeze';
        this.player.body.setGravityY(0);
        this.player.setVelocityX(0);
        this.player.setVelocityY(0);
        this.player.setBounce(0);
        this.player.setImmovable(true);

        //Configuración en la escena
        this.player.scene.sys.updateList.add(this);
        this.player.scene.sys.displayList.add(this);
        this.player.scene.physics.add.existing(this);
        this.setScale(this.size);
        this.refreshBody();
    }

    update(time, delta)
    {
        this.x = this.player.x;
        this.y = this.player.y;
    }

    breakIce() //código que maneja que el jugador congelado se descongele
    {
        this.stun--;
        if(this.stun <= 0)
        {
            this.player.state = 'normal';
            this.player.setImmovable(false);
            this.player.body.setGravityY(this.player.gravity);
            this.player.setBounce(this.player.bounceX, this.player.bounceY);
            this.destroy();
        }
    }
}