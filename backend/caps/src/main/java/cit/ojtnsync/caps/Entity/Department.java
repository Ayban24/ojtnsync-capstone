package cit.ojtnsync.caps.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.sql.Timestamp;

@Entity
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;

    private Timestamp createdAt;

    // Constructors, getters, and setters (omitted for brevity)

    // Default constructor
    public Department() {
    }

    // Parameterized constructor
    public Department(String name, Timestamp createdAt) {
        this.name = name;
        this.createdAt = createdAt;
    }

    // Getters and Setters (generated using your IDE)

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
}
