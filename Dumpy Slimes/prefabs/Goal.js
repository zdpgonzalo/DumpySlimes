class Goal extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, sprite, players) 
    {
        //Constructor del padre
        super(scene, x, y, sprite);

        //Atributos...
        //...para la configuración en la escena
        this.size = 2;//Tamaño al que se escala el sprite
        //...generales
        this.playerOrder = [];
        this.scene = scene;

        //Configuración en la escena
        scene.sys.updateList.add(this);
        scene.sys.displayList.add(this);
        scene.physics.add.existing(this);
        this.setOrigin(0, 0);
        //this.setScale(this.size);
        this.refreshBody();
        this.setCircle(12);

        //Colliders...
        //...entre jugadores y la meta
        scene.physics.add.overlap(this, players, function(goal, player) {
            goal.playerOrder.push(player.id);
            player.destroy();
            if(players.getChildren().length == 0)
            {
                goal.scene.scene.start('Score', {playerOrder: goal.playerOrder, playerOneScore: goal.scene.playerOneScore, playerTwoScore: goal.scene.playerTwoScore});
            }
        });
    }


}