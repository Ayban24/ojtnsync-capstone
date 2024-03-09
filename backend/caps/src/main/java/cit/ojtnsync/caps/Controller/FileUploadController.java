package cit.ojtnsync.caps.Controller;

import cit.ojtnsync.caps.Entity.Document;
import cit.ojtnsync.caps.Entity.SubmittedDocument;
import cit.ojtnsync.caps.Entity.UserEntity;
import cit.ojtnsync.caps.Repository.DocumentRepository;
import cit.ojtnsync.caps.Repository.SubmittedDocumentRepository;
import cit.ojtnsync.caps.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.sql.Timestamp;

@RestController
public class FileUploadController {

    @Value("${upload.directory}")
    private String uploadDirectory;

    private final DocumentRepository documentRepository;
    private final SubmittedDocumentRepository submittedDocumentRepository;
    private final UserRepository userRepository;

    public FileUploadController(DocumentRepository documentRepository, SubmittedDocumentRepository submittedDocumentRepository, UserRepository userRepository) {
        this.documentRepository = documentRepository;
        this.submittedDocumentRepository = submittedDocumentRepository;
        this.userRepository = userRepository;
    }

    static class UploadResponse {
        private final String message;
        private final Document document;

        public UploadResponse(String message, Document document) {
            this.message = message;
            this.document = document;
        }

        public String getMessage() {
            return message;
        }

        public Document getDocument() {
            return document;
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<UploadResponse> handleFileUpload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("userId") Long userId) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(new UploadResponse("Please select a file to upload", null));
        }

        try {
            String fileName = file.getOriginalFilename();
            String filePath = uploadDirectory + File.separator + fileName;

            // Save the file to the specified directory
            file.transferTo((new File(filePath)).toPath());

            // Save information about the uploaded file into a Document entity
            Document document = new Document(title, description, fileName, new Timestamp(System.currentTimeMillis()));
            document = documentRepository.save(document);

            UserEntity user = userRepository.findByUserid(userId);

            // Create and save a SubmittedDocument entity
            SubmittedDocument submittedDocument = new SubmittedDocument(document, user, null, "Pending", null, 
                    new Timestamp(System.currentTimeMillis()));
            submittedDocumentRepository.save(submittedDocument);

            UploadResponse response = new UploadResponse("File uploaded successfully", document);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(new UploadResponse("File upload failed", null));
        }
    }
}
