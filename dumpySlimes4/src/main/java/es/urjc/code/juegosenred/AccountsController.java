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
@RequestMapping("/accounts")
public class AccountsController {

	Map<String, Account> accounts = new ConcurrentHashMap<>(); 
	AtomicLong nextId = new AtomicLong(0);
	
	@GetMapping
	public Collection<Account> accounts() {
		return accounts.values();
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public Account newAccount(@RequestBody Account account) {

		String id = nextId.incrementAndGet() + "";
		account.setId(id);
		accounts.put(id, account);

		return account;
	}

	@PutMapping("/{id}")
	public ResponseEntity<Account> updateAccount(@PathVariable String id, @RequestBody Account updatedAccount) {

		Account savedAccount = accounts.get(updatedAccount.getId());

		if (savedAccount != null) {

			accounts.put(id, updatedAccount);

			return new ResponseEntity<>(updatedAccount, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@GetMapping("/{id}")
	public ResponseEntity<Account> getAccount(@PathVariable String id) {

		Account savedAccount = accounts.get(id);

		if (savedAccount != null) {
			return new ResponseEntity<>(savedAccount, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Account> eraseAccount(@PathVariable String id) {

		Account savedAccount = accounts.get(id);

		if (savedAccount != null) {
			accounts.remove(savedAccount.getId());
			
			return new ResponseEntity<>(savedAccount, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

}
