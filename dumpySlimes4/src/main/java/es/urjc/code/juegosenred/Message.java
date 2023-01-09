package es.urjc.code.juegosenred;

public class Message {

	private long id;
	private String text;
	private Account sender;
	
	public Message() {
	}
	
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}
	
	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}
	
	public Account getSender() {
		return sender;
	}

	public void setSender(Account sender) {
		this.sender = sender;
	}
	
	@Override
	public String toString() {
		return "Message [id=" + id + ", text=" + text + ", sender=" + sender.getName() + "]";
	}
}
