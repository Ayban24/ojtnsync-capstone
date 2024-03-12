package cit.ojtnsync.caps.Entity;

import java.sql.Timestamp;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import io.micrometer.common.lang.Nullable;
import jakarta.persistence.*;

@Entity
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String title;

    @Lob
    private String description;

    private String fileName;

    private String extName;

    @Column(nullable = true)
    private String hashedFileName;

    @Column(nullable = true)
    private String status;

    private Timestamp createdAt;

    @ManyToOne()
    @JoinColumn(name = "requirement_id")
    private Requirement requirement;

    @ManyToOne()
    @JoinColumn(name = "submitted_by")
    @Nullable
    private UserEntity submittedBy;

    // Constructors, getters, and setters (omitted for brevity)

    // Default constructor
    public Document() {
    }

    // Parameterized constructor
    public Document(String title, String description, String fileName, String extName, String hashedFileName, String status, Requirement requirement, UserEntity submittedBy, Timestamp createdAt) {
        this.title = title;
        this.description = description;
        this.fileName = fileName;
        this.extName = extName;
        this.hashedFileName = hashedFileName;
        this.requirement = requirement;
        this.submittedBy = submittedBy;
        this.createdAt = createdAt;
        this.status = status;
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

    public String getExtName() {
        return extName;
    }

    public void setExtName(String extName) {
        this.extName = extName;
    }

    public String getHashedFileName() {
        return hashedFileName;
    }

    public void setHashedFileName(String hashedFileName) {
        this.hashedFileName = hashedFileName;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public Requirement getRequirement() {
        return requirement;
    }

    public void setRequirement(Requirement requirement) {
        this.requirement = requirement;
    }

    public UserEntity getSubmittedBy() {
        return this.submittedBy;
    }

    public void setSubmittedBy(UserEntity submittedBy) {
        this.submittedBy = submittedBy;
    }
}
