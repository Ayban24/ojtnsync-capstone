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

    private Timestamp created_at;

    // Constructors, getters, and setters (omitted for brevity)

    // Default constructor
    public Document() {
    }

    // Parameterized constructor
    public Document(String title, String description, String fileName, Timestamp created_at) {
        this.title = title;
        this.description = description;
        this.fileName = fileName;
        this.created_at = created_at;
    }

    // Getters and Setters (generated using your IDE)

    // Omitted for brevity
}

