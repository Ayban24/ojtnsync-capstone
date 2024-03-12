package cit.ojtnsync.caps.Entity;

import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;

    private Timestamp createdAt;

    @ManyToOne()
    @JoinColumn(name = "department_id")
    private Department department;

    // Constructors, getters, and setters (you can generate them using your IDE)

    public Course() {
        // Default constructor
    }

    public Course(String name, Timestamp createdAt, Department department) {
        this.name = name;
        this.createdAt = createdAt;
        this.department = department;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }
}
