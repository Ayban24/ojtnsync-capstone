package cit.ojtnsync.caps.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import cit.ojtnsync.caps.Entity.Requirement;

public interface RequirementRepository extends JpaRepository<Requirement, Integer> {

}
