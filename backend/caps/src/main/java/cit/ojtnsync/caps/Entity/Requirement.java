package cit.ojtnsync.caps.Entity;

import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Requirement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String title;

    private Timestamp created_at;

    private String term;

    private String attachedFileName;
    private String attachedExtName;
    private String attachedHashedFileName;

    @ManyToOne()
    @JsonIgnore
    @JoinColumn(name = "department_id")
    private Department department;

    @OneToMany(mappedBy = "requirement", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("requirement")
    private List<Document> documents = new ArrayList<>();

    // Constructors, getters, and setters (omitted for brevity)

    // Default constructor
    public Requirement() {
    }

    // Parameterized constructor
    public Requirement(String title, Timestamp created_at, Department department, String term,
                       String attachedFileName, String attachedExtName, String attachedHashedFileName) {
        this.title = title;
        this.created_at = created_at;
        this.department = department;
        this.term = term;
        this.attachedFileName = attachedFileName;
        this.attachedExtName = attachedExtName;
        this.attachedHashedFileName = attachedHashedFileName;
    }

    public Requirement(String title, Department department, String term,
                       String attachedFileName, String attachedExtName, String attachedHashedFileName) {
        this.title = title;
        this.department = department;
        this.term = term;
        this.attachedFileName = attachedFileName;
        this.attachedExtName = attachedExtName;
        this.attachedHashedFileName = attachedHashedFileName;
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

    public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    public List<Document> getDocuments() {
        return this.documents;
    }

    public void setDocuments(List<Document> documents) {
        this.documents = documents;
    }

    public String getTerm() {
        return term;
    }

    public void setTerm(String term) {
        this.term = term;
    }

    @PrePersist
    protected void onCreate() {
        created_at = Timestamp.from(Instant.now());
    }

    public String getAttachedFileName() {
        return attachedFileName;
    }

    public void setAttachedFileName(String attachedFileName) {
        this.attachedFileName = attachedFileName;
    }

    public String getAttachedExtName() {
        return attachedExtName;
    }

    public void setAttachedExtName(String attachedExtName) {
        this.attachedExtName = attachedExtName;
    }

    public String getAttachedHashedFileName() {
        return attachedHashedFileName;
    }

    public void setAttachedHashedFileName(String attachedHashedFileName) {
        this.attachedHashedFileName = attachedHashedFileName;
    }
}
