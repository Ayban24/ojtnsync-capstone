package cit.ojtnsync.caps.Controller;

import cit.ojtnsync.caps.Entity.Document;
import cit.ojtnsync.caps.Service.DocumentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
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

}
