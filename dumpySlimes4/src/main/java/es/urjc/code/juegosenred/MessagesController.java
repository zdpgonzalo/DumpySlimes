package es.urjc.code.juegosenred;

import java.util.Collection;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
	
	@GetMapping
	public Collection<Message> messages() {
		return messages.values();
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public Message newMessage(@RequestBody Message message) {

		long id = nextId.incrementAndGet();
		message.setId(id);
		messages.put(id, message);

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
