package cit.ojtnsync.caps.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import java.sql.Timestamp;

@Entity
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String title;

    @Lob
    private String description;

    private String fileName;

    private Timestamp createdAt;

    // Constructors, getters, and setters (omitted for brevity)

    // Default constructor
    public Document() {
    }

    // Parameterized constructor
    public Document(String title, String description, String fileName, Timestamp createdAt) {
        this.title = title;
        this.description = description;
        this.fileName = fileName;
        this.createdAt = createdAt;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }
    
    // Omitted for brevity
}
