package cit.ojtnsync.caps.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import cit.ojtnsync.caps.Entity.Document;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Integer> {
    // You can add custom query methods here if needed
}

