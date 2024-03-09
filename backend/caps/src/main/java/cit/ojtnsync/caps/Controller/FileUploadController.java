package cit.ojtnsync.caps.Controller;

import cit.ojtnsync.caps.Entity.Document;
import cit.ojtnsync.caps.Repository.DocumentRepository;
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

    public FileUploadController(DocumentRepository documentRepository) {
        this.documentRepository = documentRepository;
    }

    @PostMapping("/upload")
    public ResponseEntity<String> handleFileUpload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam("description") String description) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Please select a file to upload");
        }

        try {
            String fileName = file.getOriginalFilename();
            String filePath = uploadDirectory + File.separator + fileName;

            // Save the file to the specified directory
            file.transferTo((new File(filePath)).toPath());

            // Save information about the uploaded file into a Document entity
            Document document = new Document(title, description, fileName, new Timestamp(System.currentTimeMillis()));

            documentRepository.save(document);

            return ResponseEntity.ok("File uploaded successfully");
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("File upload failed");
        }
    }
}
