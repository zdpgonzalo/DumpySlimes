class FreezeProyectile extends Phaser.Physics.Arcade.Sprite {
    constructor(player, target)
    {
        //Constructor del padre
        super(player.scene, player.x, player.y, 'frozenEffect');

        //Atributos...
        //...para la configuración en la escena
        this.size = 0.075;//Tamaño al que se escala el sprite
        //...generales
        this.target = target;//Jugador objetivo
        this.maxSpeed = 400;//Velocidad máxima
        this.acceleration = 4000;//Aceleración
        this.touch = false;

        //Configuración en la escena
        this.target.scene.sys.updateList.add(this);
        this.target.scene.sys.displayList.add(this);
        this.target.scene.physics.add.existing(this);
        this.setScale(this.size);
        this.refreshBody();
        this.setCircle(12);
        this.setCollideWorldBounds(true);
        this.body.onWorldBounds = true;

        //Colliders...
        //...entre el jugador objetivo y el proyectil
        this.playerCollider = this.scene.physics.add.overlap(this, target, function(proyectile, target) {
            proyectile.touch = true;
        });
        //...entre el proyectil y los bordes de la escena
        this.borderCollider = this.scene.physics.world.on('worldbounds', function(body){
            body.gameObject.destroy();
        });
    }

    update()
    {
        this.scene.physics.accelerateToObject(this, this.target, this.acceleration, this.maxSpeed, this.maxSpeed);
        if(this.touch)
        {
            this.freeze();
        }
    }

    freeze()
    {
        if(this.target.state == 'normal' || this.target.state == 'doubleJump' || this.target.state == 'freeze' || this.target.state == 'confusion' || this.target.state == 'launched')
        {
            this.target.powerupExe.resetState(this.target);
            this.target.powerupExe.changeState(this.target, 'freeze');
        }
        this.destroy();
    }
}