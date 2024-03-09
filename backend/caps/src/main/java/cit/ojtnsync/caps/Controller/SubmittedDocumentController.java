package cit.ojtnsync.caps.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import cit.ojtnsync.caps.Entity.SubmittedDocument;
import cit.ojtnsync.caps.Service.SubmittedDocumentService;

import java.util.List;

@RestController
@RequestMapping("/api/submitted-documents")
@Validated
public class SubmittedDocumentController {

    private final SubmittedDocumentService submittedDocumentService;

    public SubmittedDocumentController(SubmittedDocumentService submittedDocumentService) {
        this.submittedDocumentService = submittedDocumentService;
    }

    @GetMapping
    public ResponseEntity<List<SubmittedDocument>> getAllSubmittedDocuments() {
        List<SubmittedDocument> submittedDocuments = submittedDocumentService.getAllSubmittedDocuments();
        return ResponseEntity.ok(submittedDocuments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubmittedDocument> getSubmittedDocumentById(@PathVariable int id) {
        SubmittedDocument submittedDocument = submittedDocumentService.getSubmittedDocumentById(id);
        return ResponseEntity.ok(submittedDocument);
    }

    @PostMapping(consumes = "application/json")
    public ResponseEntity<SubmittedDocument> createSubmittedDocument(@RequestBody SubmittedDocument submittedDocument) {
        SubmittedDocument createdDocument = submittedDocumentService.createSubmittedDocument(submittedDocument);
        return ResponseEntity.ok(createdDocument);
    }

    @PutMapping(value = "/{id}", consumes = "application/json")
    public ResponseEntity<SubmittedDocument> updateSubmittedDocument(
            @PathVariable int id,
            @RequestBody SubmittedDocument submittedDocument) {
        SubmittedDocument updatedDocument = submittedDocumentService.updateSubmittedDocument(id, submittedDocument);
        return ResponseEntity.ok(updatedDocument);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubmittedDocument(@PathVariable int id) {
        submittedDocumentService.deleteSubmittedDocument(id);
        return ResponseEntity.noContent().build();
    }
}
