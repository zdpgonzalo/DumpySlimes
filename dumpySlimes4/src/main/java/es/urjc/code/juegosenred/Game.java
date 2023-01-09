package es.urjc.code.juegosenred;

import java.util.ArrayList;
import java.util.List;
import org.springframework.web.socket.WebSocketSession;

public class Game {
    
    List<Account> jugadores = new ArrayList();
    int id;
    
    public Game(int id){
    
        this.id = id;
    
    }
    public void addAccount(String id,String n,WebSocketSession s){
    
        this.jugadores.add(new Account(id,n,this.id,s));
    
    }
    
    public int getId(){
    
        return this.id;
    
    }
    
}