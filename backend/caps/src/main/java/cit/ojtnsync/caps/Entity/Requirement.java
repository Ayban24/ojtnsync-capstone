package cit.ojtnsync.caps.Entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Requirement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String title;

    private Timestamp created_at;

    @ManyToOne()
    @JoinColumn(name = "course_id")
    private Course course;

    @OneToMany(mappedBy = "requirement", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("requirement")
    private List<Document> documents = new ArrayList<>();

    // Constructors, getters, and setters (omitted for brevity)

    // Default constructor
    public Requirement() {
    }

    // Parameterized constructor
    public Requirement(String title, Timestamp created_at, Course course) {
        this.title = title;
        this.created_at = created_at;
        this.course = course;
    }

    // Getters and Setters (generated using your IDE)

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Timestamp getCreated_at() {
        return created_at;
    }

    public void setCreated_at(Timestamp created_at) {
        this.created_at = created_at;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public List<Document> getDocuments() {
        return this.documents;
    }

    public void setDocuments(List<Document> documents) {
        this.documents = documents;
    }
}
