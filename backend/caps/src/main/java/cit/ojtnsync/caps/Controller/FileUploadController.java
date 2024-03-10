package cit.ojtnsync.caps.Controller;

import cit.ojtnsync.caps.Entity.Document;
import cit.ojtnsync.caps.Entity.Requirement;
import cit.ojtnsync.caps.Entity.UserEntity;
import cit.ojtnsync.caps.Repository.DocumentRepository;
import cit.ojtnsync.caps.Repository.UserRepository;
import cit.ojtnsync.caps.Service.RequirementService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import java.io.File;
import java.io.IOException;
import java.sql.Timestamp;

@RestController
public class FileUploadController {

    @Value("${upload.directory}")
    private String uploadDirectory;

    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;

    @Autowired
	private RequirementService requirementService;

    public FileUploadController(DocumentRepository documentRepository, UserRepository userRepository) {
        this.documentRepository = documentRepository;
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
            @RequestParam("userId") Long userId,
            @RequestParam("requirementId") int requirementId) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(new UploadResponse("Please select a file to upload", null));
        }

        try {
            UserEntity submittedBy = userRepository.findByUserid(userId);
            String fileName = file.getOriginalFilename();
            String fileExt = getFileExtension(fileName);

            Requirement requirement = requirementService.getRequirementById(requirementId);
            
            // Save information about the uploaded file into a Document entity
            Document document = new Document(title, description, fileName, fileExt, null, "Pending", /*submittedBy,*/ requirement, new Timestamp(System.currentTimeMillis()));
            document = documentRepository.save(document);

            String hashedFileName = "";
            try {
                // Ensures that the hashed filename is a unique filename to prevent same file name saving
                hashedFileName = hashFilename(fileName+document.getId());
                document.setHashedFileName(hashedFileName);
                documentRepository.save(document);
            } catch (NoSuchAlgorithmException e) {
                e.printStackTrace();
            }
            
            String filePath = uploadDirectory+File.separator+hashedFileName+"."+fileExt;

            // Save the file to the specified directory
            file.transferTo((new File(filePath)).toPath());

            UploadResponse response = new UploadResponse("File uploaded successfully", document);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(new UploadResponse("File upload failed", null));
        }
    }

    // Helper method to hash the filename
    private String hashFilename(String filename) throws NoSuchAlgorithmException {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hashBytes = digest.digest(filename.getBytes());

        StringBuilder hashedFilename = new StringBuilder();
        for (byte b : hashBytes) {
            hashedFilename.append(String.format("%02x", b));
        }

        return hashedFilename.toString();
    }

    // Helper method to extract file extension
    private String getFileExtension(String filename) {
        int lastDotIndex = filename.lastIndexOf(".");
        if (lastDotIndex == -1) {
            // No file extension found
            return "";
        }
        return filename.substring(lastDotIndex + 1);
    }
}
