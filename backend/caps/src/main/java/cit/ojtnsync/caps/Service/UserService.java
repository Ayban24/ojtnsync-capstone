package cit.ojtnsync.caps.Service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cit.ojtnsync.caps.Entity.UserEntity;
import cit.ojtnsync.caps.Model.UserWithDepartmentDTO;
import cit.ojtnsync.caps.Repository.UserRepository;

@Service
public class UserService {

	@Autowired
	private UserRepository userRepository;

    public List<UserEntity> getAllUsers() {
        return userRepository.findAll();
    }
	
	// Search by studentID
    public UserEntity findByStudentID(String studentID) {
        if (userRepository.findByStudentID(studentID) != null)
            return userRepository.findByStudentID(studentID);
        else
            return null;
    }
    
    public boolean existsByStudentID(String studentID) {
        return userRepository.existsByStudentID(studentID);
    }

    public void updateUser(UserEntity user) {
        userRepository.save(user);
    }
    
    public void createUser(UserEntity userEntity) {
        userRepository.save(userEntity);
    }
    
    public List<UserEntity> searchUsers(String searchVal) {
        // Query the database to search for users by userid, firstName, lastName, or email
        return userRepository.findByStudentIDContainingOrFirstNameContainingOrLastNameContainingOrEmailContaining(searchVal, searchVal, searchVal, searchVal);
    }

    public List<UserWithDepartmentDTO> searchUserAttributes(String departmentName, String lastName, String firstName) {
        // Query the database to search for users by Department.name, lastName, and firstName
        return userRepository.findByDepartmentNameAndLastNameAndFirstName(departmentName, lastName, firstName);
    }
    
}
