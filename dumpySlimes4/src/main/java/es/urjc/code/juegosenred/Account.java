package es.urjc.code.juegosenred;

import org.springframework.web.socket.WebSocketSession;

public class Account {

	public String id;
	public String name;
	private String password;
	private boolean active;
	int id_partida; //getset
    WebSocketSession session; //getset

	public Account() {
	}
	public Account(String id,String n,int ip, WebSocketSession s){
	    
        this.name = n;
        this.id = id;
        this.id_partida = ip;
        this.session = s;
    }
	
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
	
	public boolean getActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}

	@Override
	public String toString() {
		return "Account [id=" + id + ", name=" + name + ", password=" + password + ", active=" + active + "]";
	}

}
