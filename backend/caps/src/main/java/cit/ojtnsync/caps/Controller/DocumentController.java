package cit.ojtnsync.caps.Controller;

import cit.ojtnsync.caps.Entity.Document;
import cit.ojtnsync.caps.Entity.Requirement;
import cit.ojtnsync.caps.Entity.UserEntity;
import cit.ojtnsync.caps.Service.DocumentService;
import cit.ojtnsync.caps.Service.RequirementService;
import cit.ojtnsync.caps.Service.UserService;

import org.apache.catalina.connector.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentService documentService;
    private final UserService userService;
    private final RequirementService requirementService;

    public DocumentController(DocumentService documentService, UserService userService, RequirementService requirementService) {
        this.documentService = documentService;
        this.userService = userService;
        this.requirementService = requirementService;
    }

    @GetMapping
    public ResponseEntity<List<Document>> getAllDocuments() {
        List<Document> documents = documentService.getAllDocuments();
        return ResponseEntity.ok(documents);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Document> getDocumentById(@PathVariable int id) {
        Document document = documentService.getDocumentById(id);
        return ResponseEntity.ok(document);
    }

    @PostMapping
    public ResponseEntity<Document> createDocument(@RequestBody Document document) {
        Document createdDocument = documentService.saveDocument(document);
        return ResponseEntity.ok(createdDocument);
    }

    @PutMapping("/{id}")
    @CrossOrigin(origins = "*")
    public ResponseEntity<Document> updateDocumentStatus(
            @PathVariable int id,
            @RequestParam("comment") String comment,
            @RequestParam("status") String status) {
        Document existingDocument = documentService.getDocumentById(id);
        if (existingDocument == null) {
            return ResponseEntity.notFound().build();
        }

        // Update the fields of the existing document with the fields of the updated document
        existingDocument.setComment(comment);
        existingDocument.setStatus(status);

        // Save the updated document
        Document savedDocument = documentService.saveDocument(existingDocument);
        return ResponseEntity.ok(savedDocument);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Document>> getDocumentsByUserId(@PathVariable("userId") Long userId) {
        // Fetch the user from the database
        UserEntity user = userService.findById(userId);
        
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        // Retrieve documents submitted by the user
        List<Document> documents = documentService.getDocumentsBySubmittedBy(user);

        if (!documents.isEmpty()) {
            return ResponseEntity.ok(documents);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/nlo/create")
    public ResponseEntity<Document> createNloDocument(
            @RequestParam("requirementId") int requirementId,
            @RequestParam("userId") long userId,
            @RequestParam("status") String status) {

        Document document = new Document();
        Requirement requirement = requirementService.getRequirementById(requirementId);
        UserEntity user = userService.findById(userId);
        document.setRequirement(requirement);
        document.setSubmittedBy(user);
        document.setStatus(status);
        documentService.saveDocument(document);

        return ResponseEntity.ok(document);
    }

}

