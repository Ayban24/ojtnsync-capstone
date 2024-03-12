package cit.ojtnsync.caps.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cit.ojtnsync.caps.Entity.Department;
import cit.ojtnsync.caps.Repository.DepartmentRepository;

import java.util.List;
import java.util.Optional;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    @Autowired
    public DepartmentService(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    public Department getDepartmentById(int id) {
        Optional<Department> department = departmentRepository.findById(id);
        return department.orElse(null);
    }

    public Department createDepartment(Department department) {
        return departmentRepository.save(department);
    }

    public Department updateDepartment(int id, Department updatedDepartment) {
        Optional<Department> existingDepartment = departmentRepository.findById(id);

        if (existingDepartment.isPresent()) {
            Department departmentToUpdate = existingDepartment.get();
            departmentToUpdate.setName(updatedDepartment.getName());
            // Update other attributes as needed
            return departmentRepository.save(departmentToUpdate);
        } else {
            return null;
        }
    }

    public boolean deleteDepartment(int id) {
        if (departmentRepository.existsById(id)) {
            departmentRepository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }
}
