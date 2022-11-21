class BombTrap extends Phaser.Physics.Arcade.Sprite {
    constructor(player)
    {
        //Configuración en la escena
        super(player.scene, player.x, player.y, 'star');
        player.scene.sys.updateList.add(this);
        player.scene.sys.displayList.add(this);
        player.scene.physics.add.existing(this);
        this.setScale(1.75);
        this.refreshBody();
        this.setCircle(12);
        this.setCollideWorldBounds(true);
        this.body.setAllowGravity(false);

        //Atributos generales
        this.user = player;

        //Configuración del raycaster
        this.raycaster = player.scene.raycasterPlugin.createRaycaster({debug: true});
        this.ray = this.raycaster.createRay();
        this.raycaster.mapGameObjects(this.player.group.getChildren());
        this.physics.add.overlap(this.ray, targets, function(rayFoVCircle, target){
            /*
            * What to do with game objects in line of sight.
            */
          }, this.ray.processOverlap.bind(this.ray));
    }

    update(time, delta)
    {
        this.ray.setOrigin(this.x, this.y);
    }
}