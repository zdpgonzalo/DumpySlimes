class Powerup extends Powerup {
    constructor(scene,x,y,id){
        super(scene,x,y);
        id='01';
    }

    use(Player){
       Player.setVelocityY(100);
       Player.activePowerup=this.id;
       Player.setAllowGravity(false);
       //no se si es asi o Player.body.setAllowGravity(false); si falla probar eso

       
    }
}