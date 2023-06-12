class BombTrap extends Phaser.Physics.Arcade.Sprite {
    constructor(player)
    {
        //Constructor del padre
        super(player.scene, player.x, player.y, 'bombaDesactivada');

        //Atributos...
        //...para la configuración en la escena
        this.size = 0.2;//Tamaño al que se escala el sprite
        //...generales
        this.user = player;//Referencia al jugador que ha colocado la bomba
        this.state = 'search';//Estado
        this.target = null;//Objetivo de la bomba una vez ha fijado el blanco en otro jugador
        this.maxSpeed = 150;//Velocidad máxima
        this.acceleration = 4000;//Aceleración
        this.explosionRange = 175;//Radio de la explosión
        this.launchedTime = 3000;//Duración del lanzamiento
        this.bombTime = 6000;//Duración de la bomba hasta que explota si no ha impactado en su objetivo

        //Configuración en la escena
        this.user.scene.sys.updateList.add(this);
        this.user.scene.sys.displayList.add(this);
        this.user.scene.physics.add.existing(this);
        this.setScale(this.size);
        this.refreshBody();
        this.setCircle(player.scene.textures.get('bombaDesactivada').getSourceImage().width * 0.25, 125, 125);
        this.setCollideWorldBounds(true);
        this.body.setAllowGravity(false);

        //Configuración del raycaster...
        //...crea el raycaster y el rayo que va a usar, y configura sus atributos
        this.raycaster = this.user.scene.raycasterPlugin.createRaycaster();
        this.ray = this.raycaster.createRay({
            origin: {
              x: this.x,
              y: this.y
            },
            detectionRange: 700
        });
        this.ray.autoSlice = true;
        this.ray.enablePhysics();
        this.ray.setCollisionRange(700);
        //...añade al raycaster los objetos que bloquean su visión
        this.raycaster.mapGameObjects(this.user.ground, false, {
            collisionTiles: [0,1,2] //array of tiles types which can collide with ray
        });
        this.intersections = this.ray.castCircle();

        //Colliders/overlaps...
        //...variable que se usa para acceder a la clase dentro de las funciones
        let that = this;
        //...comprueba si hay un jugador en su campo de visión, lo guarda como objetivo y cambia al estado de persecución
        this.detection = this.scene.physics.add.overlap(this.ray, this.filterList(this.user), function(rayFoVCircle, target){
            that.target = target;
            that.state = 'pursue';
            that.setTexture('bombaActivada');
            //reseteamos el raycaster para que la explosión atraviese las paredes
            that.raycaster = that.user.scene.raycasterPlugin.createRaycaster();
            that.ray = that.raycaster.createRay({
                origin: {
                  x: that.x,
                  y: that.y
                }
            });
            that.ray.enablePhysics();
            that.ray.autoSlice = true;
            that.ray.setCollisionRange(that.explosionRange);
            that.detection.active = false;
        }, this.ray.processOverlap.bind(this.ray));
        //...comprueba si ha habido una colisión con un jugador o con una plataforma, en cuyo caso explota
        this.playerOverlap = this.scene.physics.add.overlap(this, this.filterList(this.user), function(bomb, target){
            bomb.explode();
        });
    }

    update(time, delta)
    {
        //distintos comportamientos según el estado
        switch(this.state)
        {
            case 'search'://la bomba esta buscando un jugador que no sea quien la ha creado al que lanzarse
                break;
            case 'pursue'://la bomba acelera hacia el primer jugador que ha visto
                this.bombTime -= delta;
                if(this.bombTime <= 0)
                {
                    this.explode();
                }
                this.rotation = this.body.angle + (Math.PI / 2);
                this.scene.physics.accelerateToObject(this, this.target, this.acceleration, this.maxSpeed, this.maxSpeed);
                break;
            case 'exploded'://la bomba ha explotado, por lo que se destruye
                this.destroy();
                break;
        }
    }

    explode()//la bomba explota, lanzando por los aires a los jugadores que se encuentren dentro del radio de su explosión
    {
        this.ray.origin.x = this.x;
        this.ray.origin.y = this.y;
        this.ray.castCircle();
        let playerList = this.ray.overlap(this.filterList(this.user));
        let target;
        let explosion = this.user.scene.physics.add.sprite(this.x, this.y, 'explosion').setScale(1);
        this.user.scene.tweens.add({
            targets: explosion,
            alpha: { value: 0, duration: 1000, ease: 'Power2' }
        });
        for(let i = 0; i < playerList.length; i++)
        {
            target = playerList[i];
            if(target.state != 'rocket' && target.state != 'intangible' && target.state != 'freeze')
            {
                target.powerupExe.launch(target, this, this.launchedTime);
            }
        }
        this.state = 'exploded';
        setTimeout(function()
        { 
            explosion.destroy();
        }, 1000);
    }

    filterList(player) //Filtra el grupo de jugadores que tiene la escena y devuelve un array con los hijos que son distintos al player recibido
    {
        let filteredList = [];
        let playerList = player.group.getChildren();
        for(let i = 0; i < playerList.length; i++)
        {
            if(playerList[i] != player && playerList[i].state != 'intangible')
            {
                filteredList.push(playerList[i]);
            }
        }
        return filteredList;
    }
}