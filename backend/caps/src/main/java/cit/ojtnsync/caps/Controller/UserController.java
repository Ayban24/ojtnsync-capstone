package cit.ojtnsync.caps.Controller;

import java.util.List;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import cit.ojtnsync.caps.Entity.Department;
import cit.ojtnsync.caps.Entity.UserEntity;
import cit.ojtnsync.caps.Model.UserWithDepartmentDTO;
import cit.ojtnsync.caps.Service.DepartmentService;
import cit.ojtnsync.caps.Service.UserService;

@RestController
@CrossOrigin(origins = "*")
public class UserController {
	
	@Autowired
	private UserService userService;

    @Autowired
    private DepartmentService departmentService;

    @GetMapping("/users")
    public ResponseEntity<List<UserWithDepartmentDTO>> getAllUsersWithDepartment() {
        List<UserEntity> users = userService.getAllUsers();
        List<UserWithDepartmentDTO> usersWithDepartment = new ArrayList<>();

        for (UserEntity user : users) {
            usersWithDepartment.add(new UserWithDepartmentDTO(
                    user.getUserid(),
                    user.getStudentID(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getEmail(),
                    user.getDepartment()
            ));
        }

        if (!usersWithDepartment.isEmpty()) {
            return ResponseEntity.ok(usersWithDepartment);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

	
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

    @GetMapping("/searchUsers")
    public ResponseEntity<List<UserWithDepartmentDTO>> searchUsers(
            @RequestParam(name = "searchVal", required = true) String searchVal) {

        // Search for users by userid, firstName, lastName, or email
        List<UserEntity> users = userService.searchUsers(searchVal);
        List<UserWithDepartmentDTO> usersWithDepartment = new ArrayList<>();

        for (UserEntity user : users) {
            usersWithDepartment.add(new UserWithDepartmentDTO(
                    user.getUserid(),
                    user.getStudentID(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getEmail(),
                    user.getDepartment()
            ));
        }

        return ResponseEntity.ok(usersWithDepartment);

    }

    @GetMapping("/searchUserAttributes")
    public ResponseEntity<List<UserWithDepartmentDTO>> searchUserAttributes(
            @RequestParam(name = "departmentName", required = false) String departmentName,
            @RequestParam(name = "lastName", required = false) String lastName,
            @RequestParam(name = "firstName", required = false) String firstName) {

        // Search for users by Department.name, lastName, or userName
        List<UserWithDepartmentDTO> users = userService.searchUserAttributes(departmentName, lastName, firstName);
        List<UserWithDepartmentDTO> usersWithDepartment = new ArrayList<>();

        for (UserWithDepartmentDTO user : users) {
            usersWithDepartment.add(new UserWithDepartmentDTO(
                    user.getUserid(),
                    user.getStudentID(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getEmail(),
                    user.getDepartment()
            ));
        }

        return ResponseEntity.ok(usersWithDepartment);
    }

    @PutMapping("/user/{studentID}/verify")
    public ResponseEntity<String> verifyUser(@PathVariable("studentID") String studentID) {
        // Fetch the user from the database
        UserEntity user = userService.findByStudentID(studentID);
        
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        // Update the user's isVerified field to true
        user.setVerified(true);

        // Save the updated user
        userService.updateUser(user);

        return ResponseEntity.ok("User verified successfully");
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
        UserEntity user = new UserEntity(studentID, firstName, lastName, department, email, password, false);
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
