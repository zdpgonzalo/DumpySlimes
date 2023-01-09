class PowerupBubble extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, players, direction)
    {
        // Constructor del padre
        super(scene, x, y, `burbujaDorada`);

        // Atributos...
        //...para la configuración en la escena
        this.size = 0.08; // Tamaño al que se escala el sprite
        this.speedX = scene.CONFIG.gameWidth * 0.1; // Velocidad de la burbuja al moverse por la escena
        this.speedY = this.speedX * 2.5; // Velocidad de oscilación
        //...generales
        this.initialY = y; // Posición en el eje Y inicial
        this.music = this.scene.sound.add('burbuja');
        //...loot tables
        this.firstPowerups = [
            ['confusion', 'confusion', 'confusion', 'confusion', 'confusion', 'confusion', 'confusion', 'confusion', 'confusion', 'confusion'],
            ['expansiveWave', 'expansiveWave', 'expansiveWave', 'expansiveWave', 'expansiveWave', 'expansiveWave', 'expansiveWave', 'expansiveWave', 'expansiveWave', 'expansiveWave'],
            ['expansiveWave', 'expansiveWave', 'expansiveWave', 'expansiveWave', 'expansiveWave', 'expansiveWave', 'expansiveWave', 'expansiveWave', 'expansiveWave', 'expansiveWave'],
            ['expansiveWave', 'expansiveWave', 'expansiveWave', 'expansiveWave', 'expansiveWave', 'expansiveWave', 'expansiveWave', 'expansiveWave', 'expansiveWave', 'expansiveWave'],
            ['confusion', 'confusion', 'confusion', 'confusion', 'confusion', 'confusion', 'confusion', 'confusion', 'confusion', 'confusion'],
            ['doubleJump', 'doubleJump', 'doubleJump', 'doubleJump', 'doubleJump', 'doubleJump', 'doubleJump', 'doubleJump', 'doubleJump', 'doubleJump'],
            ['doubleJump', 'doubleJump', 'doubleJump', 'doubleJump', 'doubleJump', 'doubleJump', 'doubleJump', 'doubleJump', 'doubleJump', 'doubleJump'],
            ['doubleJump', 'doubleJump', 'doubleJump', 'doubleJump', 'doubleJump', 'intangible', 'intangible', 'intangible', 'intangible', 'intangible'],
            ['intangible', 'intangible', 'intangible', 'intangible', 'intangible', 'intangible', 'intangible', 'intangible', 'intangible', 'intangible'],
            ['intangible', 'intangible', 'intangible', 'intangible', 'intangible', 'intangible', 'intangible', 'intangible', 'intangible', 'intangible']
        ]
        this.secondPowerups = [
            ['doubleJump', 'doubleJump', 'doubleJump', 'doubleJump', 'doubleJump', 'doubleJump', 'doubleJump', 'doubleJump', 'doubleJump', 'doubleJump'],
            ['doubleJump', 'doubleJump', 'doubleJump', 'doubleJump', 'doubleJump', 'doubleJump', 'doubleJump', 'doubleJump', 'doubleJump', 'doubleJump'],
            ['doubleJump', 'doubleJump', 'doubleJump', 'doubleJump', 'doubleJump', 'doubleJump', 'doubleJump', 'doubleJump', 'doubleJump', 'doubleJump'],
            ['freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze'],
            ['confusion', 'confusion', 'confusion', 'confusion', 'confusion', 'confusion', 'confusion', 'confusion', 'confusion', 'confusion'],
            ['confusion', 'confusion', 'confusion', 'confusion', 'confusion', 'confusion', 'confusion', 'confusion', 'confusion', 'confusion'],
            ['rocket', 'rocket', 'rocket', 'rocket', 'rocket', 'rocket', 'rocket', 'rocket', 'rocket', 'rocket'],
            ['rocket', 'rocket', 'rocket', 'rocket', 'rocket', 'rocket', 'rocket', 'rocket', 'rocket', 'rocket'],
            ['freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze'],
            ['freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze', 'freeze']
        ]

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
        this.playerOverlap = scene.physics.add.overlap(this, players, function(bubble, player) {
            bubble.music.play();
            if(player.powerups.length < 2)
            {
                player.grabPowerup(bubble.createPowerup(player)); // Otorga un powerup al jugador
            }
            bubble.destroy();
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

    createPowerup(player) // Escoje un powerup random de la loot table correspondiente a la posición del jugador
    {
        let randomX = Math.floor(Math.random() * 10);
        let randomY = Math.floor(Math.random() * 10);
        switch(player.position)
        {
            case 1:
                var p = this.firstPowerups[randomX][randomY];
                return p;
            case 2:
                var p = this.secondPowerups[randomX][randomY];
                return p;
        }
    }
}