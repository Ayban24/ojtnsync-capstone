package cit.ojtnsync.caps.Service;

import cit.ojtnsync.caps.Entity.Course;
import cit.ojtnsync.caps.Repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CourseService {

    private final CourseRepository courseRepository;

    @Autowired
    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Course getCourseById(int id) {
        return courseRepository.findById(id)
                .orElse(null);
    }
    

    public Course createCourse(Course course) {
        return courseRepository.save(course);
    }

    public Course updateCourse(int id, Course updatedCourse) {
        Optional<Course> existingCourseOptional = courseRepository.findById(id);
        if (existingCourseOptional.isPresent()) {
            Course existingCourse = existingCourseOptional.get();
            existingCourse.setName(updatedCourse.getName());
            // Set other attributes as needed
            return courseRepository.save(existingCourse);
        } else {
            // Handle not found scenario
            return null;
        }
    }

    public void deleteCourse(int id) {
        courseRepository.deleteById(id);
    }
}
