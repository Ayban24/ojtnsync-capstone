package cit.ojtnsync.caps.Service;

import org.springframework.stereotype.Service;

import cit.ojtnsync.caps.Entity.Requirement;
import cit.ojtnsync.caps.Repository.RequirementRepository;

import java.util.List;

@Service
public class RequirementService {

    private final RequirementRepository requirementRepository;

    public RequirementService(RequirementRepository requirementRepository) {
        this.requirementRepository = requirementRepository;
    }

    public List<Requirement> getAllRequirements() {
        return requirementRepository.findAll();
    }

    public Requirement getRequirementById(int id) {
        return requirementRepository.findById(id)
                .orElse(null);
    }

    public Requirement createRequirement(Requirement requirement) {
        return requirementRepository.save(requirement);
    }

    public Requirement updateRequirement(int id, Requirement requirement) {
        if (requirementRepository.existsById(id)) {
            requirement.setId(id);
            return requirementRepository.save(requirement);
        }
        return null;
    }

    public void deleteRequirement(int id) {
        requirementRepository.deleteById(id);
    }
}
