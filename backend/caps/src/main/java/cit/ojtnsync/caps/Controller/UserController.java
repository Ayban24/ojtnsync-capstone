package cit.ojtnsync.caps.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.SecurityProperties.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;

import cit.ojtnsync.caps.Entity.Department;
import cit.ojtnsync.caps.Entity.UserEntity;
import cit.ojtnsync.caps.Service.DepartmentService;
import cit.ojtnsync.caps.Service.UserService;

@RestController
@CrossOrigin(origins = "*")
public class UserController {
	
	@Autowired
	private UserService userService;

    @Autowired
    private DepartmentService departmentService;
	
	@GetMapping("/getByUserid")
    public ResponseEntity findByUserid(
            @RequestParam(name = "studentID", required = false, defaultValue = "0") String studentID,
            @RequestParam(name = "password", required = false, defaultValue = "0") String password) {

        UserEntity user = userService.findByStudentID(studentID);

        if (user != null && user.getPassword().equals(password)) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Log-in invalid");
        }
    }

    @GetMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestParam(name = "studentID", required = false, defaultValue = "0") String studentID,
            @RequestParam(name = "password", required = false, defaultValue = "0") String password) {

        UserEntity user = userService.findByStudentID(studentID);

        if (user != null && user.getPassword().equals(password)) {
            // User authentication successful
            LoginResponse response = new LoginResponse("Login successful", user);
            return ResponseEntity.ok(response);
        } else {
            // User authentication failed
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new LoginResponse("Login invalid", null));
        }
    }

    // Custom class to represent the login response
    private static class LoginResponse {
        private final String message;
        private final UserEntity user;

        public LoginResponse(String message, UserEntity user) {
            this.message = message;
            this.user = user;
        }

        public String getMessage() {
            return message;
        }

        public UserEntity getUser() {
            return user;
        }
    }
	
	@PostMapping("/signup")
    @CrossOrigin(origins = "*")
    public ResponseEntity<String> signup(
        @RequestParam("studentID") String studentID,
        @RequestParam("firstName") String firstName,
        @RequestParam("lastName") String lastName,
        @RequestParam("department_id") int department_id,
        @RequestParam("email") String email,
        @RequestParam("password") String password) {

        Department department = departmentService.getDepartmentById(department_id);
        UserEntity user = new UserEntity(studentID, firstName, lastName, department, email, password);
        // Check if the studentID already exists
        if (userService.existsByStudentID(user.getStudentID())) {
            return new ResponseEntity<>("StudentID already exists", HttpStatus.BAD_REQUEST);
        }

        // Save the user if studentID is unique
        userService.createUser(user);
        return new ResponseEntity<>("User created successfully", HttpStatus.CREATED);
    }
	
	@GetMapping("/userByStudentID/{studentID}")
    public ResponseEntity<UserEntity> getUserByStudentID(@PathVariable String studentID) {
        // Call the service method to fetch user data by studentID
        UserEntity user = userService.findByStudentID(studentID);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
	

}
