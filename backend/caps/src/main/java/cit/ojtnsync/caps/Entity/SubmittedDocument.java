package cit.ojtnsync.caps.Entity;

import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
public class SubmittedDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "document_id", nullable = false)
    private Document document;

    @ManyToOne
    @JoinColumn(name = "submitted_by", nullable = false)
    private UserEntity submittedBy;

    @ManyToOne
    @JoinColumn(name = "validated_by", nullable = true)
    private UserEntity validatedBy;

    @Column(nullable = false)
    private String status;

    @Lob
    private String comment;

    @Column(nullable = false)
    private Timestamp createdAt;

    // Constructors

    // Default constructor
    public SubmittedDocument() {
    }

    // Parameterized constructor
    public SubmittedDocument(Document document, UserEntity submittedBy, UserEntity validatedBy,
                              String status, String comment, Timestamp createdAt) {
        this.document = document;
        this.submittedBy = submittedBy;
        this.validatedBy = validatedBy;
        this.status = status;
        this.comment = comment;
        this.createdAt = createdAt;
    }

    // Getters and Setters

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Document getDocument() {
        return document;
    }

    public void setDocument(Document document) {
        this.document = document;
    }

    public UserEntity getSubmittedBy() {
        return submittedBy;
    }

    public void setSubmittedBy(UserEntity submittedBy) {
        this.submittedBy = submittedBy;
    }

    public UserEntity getValidatedBy() {
        return validatedBy;
    }

    public void setValidatedBy(UserEntity validatedBy) {
        this.validatedBy = validatedBy;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }
}
