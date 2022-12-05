class PowerupBubble extends Phaser.Physics.Arcade.Sprite {//Burbujas que aparecen en el nivel y otorgan powerups
    constructor(scene, x, y, players, direction)
    {
        //Constructor del padre
        super(scene, x, y, `burbujaDorada`);

        //Atributos...
        //...para la configuración en la escena
        this.size = 0.08;//Tamaño al que se escala el sprite
        this.speedX = scene.CONFIG.gameWidth * 0.1;// Velocidad de la burbuja al moverse por la escena
        this.speedY = this.speedX * 2.5;// Velocidad de oscilación
        //...listas de powerups
        this.firstPowerups = [
            ['confusion', 'confusion', 'confusion', 'confusion', 'confusion', 'confusion', 'confusion', 'confusion', 'confusion', 'confusion'],
            ['expansiveWave', 'expansiveWave', 'expansiveWave', 'expansiveWave', 'expansiveWave', 'expansiveWave', 'expansiveWave', 'expansiveWave', 'expansiveWave', 'expansiveWave'],
            ['thief', 'thief', 'thief', 'thief', 'thief', 'thief', 'thief', 'thief', 'thief', 'thief'],
            ['bombTrap', 'bombTrap', 'bombTrap', 'bombTrap', 'bombTrap', 'bombTrap', 'bombTrap', 'bombTrap', 'bombTrap', 'bombTrap'],
            ['bombTrap', 'bombTrap', 'bombTrap', 'bombTrap', 'bombTrap', 'bombTrap', 'bombTrap', 'bombTrap', 'bombTrap', 'bombTrap'],
            ['doubleJump', 'doubleJump', 'doubleJump', 'doubleJump', 'doubleJump', 'doubleJump', 'doubleJump', 'doubleJump', 'doubleJump', 'doubleJump'],
            ['doubleJump', 'doubleJump', 'doubleJump', 'doubleJump', 'doubleJump', 'doubleJump', 'doubleJump', 'doubleJump', 'doubleJump', 'doubleJump'],
            ['doubleJump', 'doubleJump', 'doubleJump', 'doubleJump', 'doubleJump', 'intangible', 'intangible', 'intangible', 'intangible', 'intangible'],
            ['intangible', 'intangible', 'intangible', 'intangible', 'intangible', 'intangible', 'intangible', 'intangible', 'intangible', 'intangible'],
            ['intangible', 'intangible', 'intangible', 'intangible', 'intangible', 'intangible', 'intangible', 'intangible', 'intangible', 'intangible']
        ]
        /*this.secondPowerups = [
            ['doubleJump', 'doubleJump', 'doubleJump', 'doubleJump', 'doubleJump', 'doubleJump', 'doubleJump', 'doubleJump', 'doubleJump', 'doubleJump'],
            ['doubleJump', 'doubleJump', 'doubleJump', 'doubleJump', 'doubleJump', 'doubleJump', 'doubleJump', 'doubleJump', 'doubleJump', 'doubleJump'],
            ['doubleJump', 'doubleJump', 'doubleJump', 'doubleJump', 'doubleJump', 'thief', 'thief', 'thief', 'thief', 'thief'],
            ['thief', 'thief', 'thief', 'thief', 'thief', 'thief', 'thief', 'thief', 'thief', 'thief'],
            ['confusion', 'confusion', 'confusion', 'confusion', 'confusion', 'confusion', 'confusion', 'confusion', 'confusion', 'confusion'],
            ['confusion', 'confusion', 'confusion', 'confusion', 'confusion', 'confusion', 'confusion', 'confusion', 'confusion', 'confusion'],
            ['rocket', 'rocket', 'rocket', 'rocket', 'rocket', 'rocket', 'rocket', 'rocket', 'rocket', 'rocket'],
            ['thief', 'thief', 'thief', 'thief', 'thief', 'rocket', 'rocket', 'rocket', 'rocket', 'rocket'],
            ['freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze'],
            ['freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze']
        ]*/
        this.secondPowerups = [
            ['freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze'],
            ['freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze'],
            ['freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze'],
            ['freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze'],
            ['freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze'],
            ['freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze'],
            ['freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze'],
            ['freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze'],
            ['freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze'],
            ['freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze']
        ]
        //...generales
        this.id = undefined;
        this.scene = scene;
        this.initialY = y;

        //Configuración en la escena
        scene.sys.updateList.add(this);
        scene.sys.displayList.add(this);
        scene.physics.add.existing(this);
        this.setScale(this.size);
        this.refreshBody();
        this.setCircle(scene.textures.get('burbujaDorada').getSourceImage().width * 0.5);
        this.setVelocityX(this.speedX * direction);
        this.setVelocityY(this.speedY);

        //Colliders...
        //...entre jugadores y PowerupBubble
        this.playerOverlap = scene.physics.add.overlap(this, players, function(powerup, player) {
            if(player.powerups.length < 2)
            {
                player.grabPowerup(powerup.createPowerup(player));
            }
            powerup.destroy();
        });
    }

    update(time, delta)
    {
        if(this.y > this.initialY)
        {
            this.body.velocity.y -= 0.5 * delta;
        }
        else
        {
            this.body.velocity.y += 0.5 * delta;
        }
        if(this.x < 0 || this.x > this.scene.CONFIG.gameWidth)
        {
            this.destroy();
        }
    }

    createPowerup(player)
    {
        let randomX = Math.floor(Math.random() * 10);
        let randomY = Math.floor(Math.random() * 10);
        switch(player.position)
        {
            case 1:
                return this.firstPowerups[randomX][randomY];
            case 2:
                return this.secondPowerups[randomX][randomY];
        }
    }
}