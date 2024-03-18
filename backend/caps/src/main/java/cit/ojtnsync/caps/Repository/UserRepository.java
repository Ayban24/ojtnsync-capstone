package cit.ojtnsync.caps.Repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import cit.ojtnsync.caps.Entity.UserEntity;
import cit.ojtnsync.caps.Model.UserWithDepartmentDTO;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long>{

		UserEntity findByUserid(Long userid);
		UserEntity findByStudentID(String studentID);
		boolean existsByStudentID(String studentID);

		// Define a custom query method to search for users by userid, firstName, lastName, or email
    	List<UserEntity> findByStudentIDContainingOrFirstNameContainingOrLastNameContainingOrEmailContaining(
            String studentID, String firstName, String lastName, String email);

		@Query("SELECT " +
            "NEW cit.ojtnsync.caps.Model.UserWithDepartmentDTO(u.userid, u.studentID, u.firstName, u.lastName, u.email, d, u.isVerified) " +
        "FROM " +
            "UserEntity u " +
        "JOIN " +
            "u.department d " +
        "WHERE " +
            "d.name LIKE CONCAT('%', :departmentName, '%') " +
            "AND u.lastName LIKE CONCAT('%', :lastName, '%') " +
            "AND u.firstName LIKE CONCAT('%', :firstName, '%')")
		List<UserWithDepartmentDTO> findByDepartmentNameAndLastNameAndFirstName(
				@Param("departmentName") String departmentName,
				@Param("lastName") String lastName,
				@Param("firstName") String firstName);



}
