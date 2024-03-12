package cit.ojtnsync.caps.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import cit.ojtnsync.caps.Entity.Course;

public interface CourseRepository extends JpaRepository<Course, Integer> {
    // You can add custom queries or methods here if needed
}
