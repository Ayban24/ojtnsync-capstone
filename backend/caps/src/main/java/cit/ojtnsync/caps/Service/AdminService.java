package cit.ojtnsync.caps.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cit.ojtnsync.caps.Entity.AdminEntity;
import cit.ojtnsync.caps.Entity.UserEntity;
import cit.ojtnsync.caps.Repository.AdminRepository;
@Service
public class AdminService {
	
	@Autowired
	private AdminRepository adminRepository;
	
	 public boolean existsByFacultyId(String facultyId) {
	        return adminRepository.existsByFacultyId(facultyId);
	    }
	 public void createAdmin(AdminEntity adminEntity) {
	        adminRepository.save(adminEntity);
	    }
	 public List<AdminEntity> getAllAdmins() {
	        return adminRepository.findAll();
	    }
	 public AdminEntity findByFacultyId(String facultyId) {
	        if (adminRepository.findByFacultyId(facultyId) != null)
	            return adminRepository.findByFacultyId(facultyId);
	        else
	            return null;
	    }
}
