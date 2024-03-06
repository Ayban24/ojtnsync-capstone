package cit.ojtnsync.caps.Controller;

import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import cit.ojtnsync.caps.Entity.AdminEntity;
import cit.ojtnsync.caps.Service.AdminService;

@RestController
@CrossOrigin(origins = "*")

public class AdminController {
	
	@Autowired
	private AdminService adminService;
	
	 @GetMapping("/getByFacultyId")
	 public ResponseEntity findByFacultyId(
	         @RequestParam(name = "facultyId", required = false, defaultValue = "0") String facultyId,
	         @RequestParam(name = "password", required = false, defaultValue = "0") String password) {	

	     AdminEntity admin = adminService.findByFacultyId(facultyId);

	     if (admin != null && admin.getPassword().equals(password)) {
	         return ResponseEntity.ok(admin);
	     } else {
	         return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Log-in invalid");
	     }
	 }
	
	@PostMapping("/adminsignup")
    public ResponseEntity<String> signup(@RequestBody AdminEntity user) {
        // Check if the studentID already exists
        if (adminService.existsByFacultyId(user.getFacultyId())) {
            return new ResponseEntity<>("FacultyID already exists", HttpStatus.BAD_REQUEST);
        }

        // Save the user if studentID is unique
        adminService.createAdmin(user);
        return new ResponseEntity<>("Admin created successfully", HttpStatus.CREATED);
    }
	 @GetMapping("/admins")
	    public ResponseEntity<List<AdminEntity>> getAllAdmins() {
	        List<AdminEntity> admins = adminService.getAllAdmins();
	        if (admins.isEmpty()) {
	            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	        }
	        return new ResponseEntity<>(admins, HttpStatus.OK);
	    }
	
}
