package cit.ojtnsync.caps.Entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
public class Requirement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String title;

    private Timestamp created_at;

    @OneToMany(mappedBy = "requirement", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnoreProperties("requirement")
    private List<Document> documents = new ArrayList<>();

    // Constructors, getters, and setters (omitted for brevity)

    // Default constructor
    public Requirement() {
    }

    // Parameterized constructor
    public Requirement(String title, Timestamp created_at) {
        this.title = title;
        this.created_at = created_at;
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

    public List<Document> getDocuments() {
        return this.documents;
    }
    public void setDocuments(List<Document> documents) {
        this.documents = documents;
    }
}
