class Goal extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, players) 
    {
        // Constructor del padre
        super(scene, x, y, 'meta');

        // Atributos...
        //...para la configuración en la escena
        this.size = 0.40; // Tamaño al que se escala el sprite
        //...generales
        this.playerOrder = []; // Array que guarda el ordenen que los jugadores han llegado a la meta
        this.scene = scene;

        // Configuración en la escena
        scene.sys.updateList.add(this);
        scene.sys.displayList.add(this);
        scene.physics.add.existing(this);
        this.setOrigin(0, 0);
        this.setScale(this.size);
        this.refreshBody();
        this.setCircle(scene.textures.get('meta').getSourceImage().width * 0.5);

        // Colliders...
        //...entre jugadores y la meta
        scene.physics.add.overlap(this, players, function(goal, player) {
            goal.playerOrder.push(player.id);
            player.destroy();
            if(players.getChildren().length == 1) // Si todos los jugadores menos 1 han llegado a la meta se pasa a la escena de puntuación
            {
                goal.scene.scene.start('Score', {playerOrder: goal.playerOrder, playerOneScore: goal.scene.playerOneScore, playerTwoScore: goal.scene.playerTwoScore});
            }
        });
    }


}