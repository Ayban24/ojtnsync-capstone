package cit.ojtnsync.caps.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import cit.ojtnsync.caps.Entity.SubmittedDocument;

@Repository
public interface SubmittedDocumentRepository extends JpaRepository<SubmittedDocument, Integer> {
    // You can add custom queries or methods if needed
}
