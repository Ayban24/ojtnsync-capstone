package cit.ojtnsync.caps.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cit.ojtnsync.caps.Entity.Document;
import cit.ojtnsync.caps.Repository.DocumentRepository;

import java.util.List;
import java.util.Optional;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;

    @Autowired
    public DocumentService(DocumentRepository documentRepository) {
        this.documentRepository = documentRepository;
    }

    public List<Document> getAllDocuments() {
        return documentRepository.findAll();
    }

    public Optional<Document> getDocumentById(int id) {
        return documentRepository.findById(id);
    }

    public Document saveDocument(Document document) {
        // You can add additional business logic/validation here if needed
        return documentRepository.save(document);
    }

    public void deleteDocumentById(int id) {
        documentRepository.deleteById(id);
    }
}
