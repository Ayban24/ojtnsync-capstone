package cit.ojtnsync.caps.Model;

import cit.ojtnsync.caps.Entity.Department;

public class UserWithDepartmentDTO {
    private Long userid;
    private String studentID;
    private String firstName;
    private String lastName;
    private String email;
    private Department department;
    // Add other department attributes as needed

    public UserWithDepartmentDTO(Long userid, String studentID, String firstName, String lastName, String email, Department department) {
        this.userid = userid;
        this.studentID = studentID;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.department = department;
    }

    public Long getUserid() {
        return userid;
    }

    public void setUserid(Long userid) {
        this.userid = userid;
    }

    public String getStudentID() {
        return studentID;
    }

    public void setStudentID(String studentID) {
        this.studentID = studentID;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    // Add getters and setters for other department attributes as needed
}
