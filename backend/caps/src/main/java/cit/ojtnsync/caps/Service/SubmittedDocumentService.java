package cit.ojtnsync.caps.Service;

import org.springframework.stereotype.Service;

import cit.ojtnsync.caps.Entity.SubmittedDocument;
import cit.ojtnsync.caps.Repository.SubmittedDocumentRepository;

import java.util.List;

@Service
public class SubmittedDocumentService {

    private final SubmittedDocumentRepository submittedDocumentRepository;

    public SubmittedDocumentService(SubmittedDocumentRepository submittedDocumentRepository) {
        this.submittedDocumentRepository = submittedDocumentRepository;
    }

    public List<SubmittedDocument> getAllSubmittedDocuments() {
        return submittedDocumentRepository.findAll();
    }

    public SubmittedDocument getSubmittedDocumentById(int id) {
        return submittedDocumentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Submitted Document not found with id: " + id));
    }

    public SubmittedDocument createSubmittedDocument(SubmittedDocument submittedDocument) {
        return submittedDocumentRepository.save(submittedDocument);
    }

    public SubmittedDocument updateSubmittedDocument(int id, SubmittedDocument submittedDocument) {
        SubmittedDocument existingDocument = getSubmittedDocumentById(id);

        // Update fields as needed
        existingDocument.setStatus(submittedDocument.getStatus());
        existingDocument.setComment(submittedDocument.getComment());

        return submittedDocumentRepository.save(existingDocument);
    }

    public void deleteSubmittedDocument(int id) {
        submittedDocumentRepository.deleteById(id);
    }
}
