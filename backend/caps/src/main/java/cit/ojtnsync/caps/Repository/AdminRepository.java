package cit.ojtnsync.caps.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import cit.ojtnsync.caps.Entity.AdminEntity;
import cit.ojtnsync.caps.Entity.UserEntity;

@Repository
public interface AdminRepository extends JpaRepository<AdminEntity, Long> {
	AdminEntity findByFacultyId(String FacultyId);

	boolean existsByFacultyId(String facultyId);
}
