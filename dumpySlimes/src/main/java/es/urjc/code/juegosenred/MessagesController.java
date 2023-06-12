package es.urjc.code.juegosenred;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Collection;
import java.util.Map;
import java.util.Scanner;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/messages")
public class MessagesController {

	Map<Long, Message> messages = new ConcurrentHashMap<>(); 
	AtomicLong nextId = new AtomicLong(0);
	
	//@CrossOrigin(origins = {"http://90.174.212.121:8080/", "http://localhost:8080/"})
	@GetMapping
	public Collection<Message> messages() {
		return messages.values();
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public Message newMessage(@RequestBody Message message) {

		if (messages.size() == 0) {
			try {
		      File myObj = new File("src\\main\\resources\\static\\Messages.txt");
		      Scanner myReader = new Scanner(myObj);
		      while (myReader.hasNextLine()) {
		        String data = myReader.nextLine();
		        Message oldMessage = new Message();
		        oldMessage.setText(data);
		        long id = nextId.incrementAndGet();
		        oldMessage.setId(id);
				messages.put(id, oldMessage);
		      }
		      myReader.close();
		    } catch (FileNotFoundException e) {
		      System.out.println("An error occurred.");
		      e.printStackTrace();
		    }
		}
		
		long id = nextId.incrementAndGet();
		message.setId(id);
		messages.put(id, message);
		
		try {
	      File myObj = new File("src\\main\\resources\\static\\Messages.txt");
	      if (myObj.createNewFile()) {
	        System.out.println("File created: " + myObj.getName());
	      } else {
	        System.out.println("File already exists.");
	      }
	    } catch (IOException e) {
	      System.out.println("An error occurred.");
	      e.printStackTrace();
	    }
		
		try {
	      FileWriter myWriter = new FileWriter("src\\main\\resources\\static\\Messages.txt");
	      for (Long key : messages.keySet()) { 
	    	  myWriter.write(messages.get(key).getText());
	    	  myWriter.write("\n");
    	  }
	      myWriter.close();
	      System.out.println("Successfully wrote to the file.");
	    } catch (IOException e) {
	      System.out.println("An error occurred.");
	      e.printStackTrace();
	    }

		return message;
	}

	@PutMapping("/{id}")
	public ResponseEntity<Message> updateMessage(@PathVariable long id, @RequestBody Message updatedMessage) {

		Message savedMessage = messages.get(updatedMessage.getId());

		if (savedMessage != null) {

			messages.put(id, updatedMessage);

			return new ResponseEntity<>(updatedMessage, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@GetMapping("/{id}")
	public ResponseEntity<Message> getMessage(@PathVariable long id) {

		Message savedMessage = messages.get(id);

		if (savedMessage != null) {
			return new ResponseEntity<>(savedMessage, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Message> eraseMessage(@PathVariable long id) {

		Message savedMessage = messages.get(id);

		if (savedMessage != null) {
			messages.remove(savedMessage.getId());
			
			return new ResponseEntity<>(savedMessage, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

}
