package cit.ojtnsync.caps.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import cit.ojtnsync.caps.Entity.Department;
import cit.ojtnsync.caps.Entity.Document;
import cit.ojtnsync.caps.Entity.Requirement;
import cit.ojtnsync.caps.Service.DepartmentService;
import cit.ojtnsync.caps.Service.RequirementService;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/requirements")
public class RequirementController {

    private final RequirementService requirementService;
    private final DepartmentService departmentService;

    public RequirementController(RequirementService requirementService, DepartmentService departmentService) {
        this.requirementService = requirementService;
        this.departmentService = departmentService;
    }

    @GetMapping
    public ResponseEntity<List<Requirement>> getAllRequirements(long userid) {
        List<Requirement> requirements = requirementService.getAllRequirements();

        // Filter documents for each requirement based on userid
        for (Requirement requirement : requirements) {
            List<Document> filteredDocuments = requirementService.getFilteredDocumentsForRequirement(requirement.getId(), userid);
            requirement.setDocuments(filteredDocuments);
        }

        return ResponseEntity.ok(requirements);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Requirement> getRequirementById(@PathVariable int id) {
        Requirement requirement = requirementService.getRequirementById(id);
        return ResponseEntity.ok(requirement);
    }

    @PostMapping
    public ResponseEntity<Requirement> createRequirement(
            @RequestParam("requirementTitle") String requirementTitle,
            @RequestParam("requirementTerm") String requirementTerm,
            @RequestParam("departmentId") int departmentId) {
        Department department = departmentService.getDepartmentById(departmentId);
        Requirement requirement = new Requirement(requirementTitle, department, requirementTerm, null, null, null);
        Requirement createdRequirement = requirementService.createRequirement(requirement);
        return ResponseEntity.ok(createdRequirement);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Requirement> updateRequirement(
            @PathVariable int id,
            @RequestBody Requirement requirement) {
        Requirement updatedRequirement = requirementService.updateRequirement(id, requirement);
        return ResponseEntity.ok(updatedRequirement);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRequirement(@PathVariable int id) {
        requirementService.deleteRequirement(id);
        return ResponseEntity.noContent().build();
    }
    
    // Mapping to get requirements by department
    @GetMapping("/department/{departmentId}")
    public ResponseEntity<List<Requirement>> getRequirementsByDepartment(long userid, @PathVariable int departmentId) {
        List<Requirement> requirements = requirementService.getRequirementsByDepartment(departmentId);
        
        // Filter documents for each requirement based on userid
        for (Requirement requirement : requirements) {
            List<Document> filteredDocuments = requirementService.getFilteredDocumentsForRequirement(requirement.getId(), userid);
            requirement.setDocuments(filteredDocuments);
        }
        return ResponseEntity.ok(requirements);
    }

    // Mapping to get requirements by department for Admin
    @GetMapping("/admin/department/{departmentId}")
    public ResponseEntity<List<Requirement>> getAdminRequirementsByDepartment(long userid, @PathVariable int departmentId) {
        Department department = departmentService.getDepartmentById(departmentId);
        List<Requirement> requirements;
        if(department.getName().toLowerCase().equals("nlo")) 
            requirements = requirementService.getAllRequirements();
        else
            requirements = requirementService.getRequirementsByDepartment(departmentId);
        return ResponseEntity.ok(requirements);
    }
}
