package cit.ojtnsync.caps.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import cit.ojtnsync.caps.Entity.UserEntity;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long>{

		UserEntity findByUserid(Long userid);
		UserEntity findByStudentID(String studentID);
		boolean existsByStudentID(String studentID);
}
