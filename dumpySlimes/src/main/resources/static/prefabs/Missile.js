class Missile extends Phaser.Physics.Arcade.Sprite {
    constructor(player)
    {
        //Constructor del padre
        super(player.scene, player.x, player.y, 'star');

        //Atributos generales

        //Configuración en la escena
        this.user.scene.sys.updateList.add(this);
        this.user.scene.sys.displayList.add(this);
        this.user.scene.physics.add.existing(this);
        this.setScale(2);
        this.refreshBody();
        this.setCircle(12);
        this.setCollideWorldBounds(true);
        this.body.setAllowGravity(false);
    }

    update(time, delta)
    {
        
    }
}