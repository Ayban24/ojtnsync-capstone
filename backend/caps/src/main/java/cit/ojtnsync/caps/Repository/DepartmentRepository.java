package cit.ojtnsync.caps.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import cit.ojtnsync.caps.Entity.Department;

public interface DepartmentRepository extends JpaRepository<Department, Integer> {
    // You can add custom queries or methods here if needed
}
