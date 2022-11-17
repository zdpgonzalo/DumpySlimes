class Powerup extends Phaser.Physics.Arcade.Sprite {
    constructor(scene,x,y,sprite,id)
    {
        super(scene, x, y, sprite);
        scene.sys.updateList.add(this);
        scene.sys.displayList.add(this);
        //x= Phaser.Math.Between(1,719);
        //y= Phaser.Math.Between(1,1279);
        this.setCollideWorldBounds(true);
        this.setCircle(5);
        id=00;
    }

}