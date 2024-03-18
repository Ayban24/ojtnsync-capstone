package cit.ojtnsync.caps.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
@Table(name="tbl_user")
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userid;

    @Column(name = "student_id", nullable = false, unique = true)
    private String studentID;

    private String firstName;
    private String lastName;

    @ManyToOne()
    @JsonIgnore
    @JoinColumn(name = "department_id")
    private Department department;

    private String email;
    private String password;
    
    private boolean isVerified;

    public UserEntity() {
    }

    public UserEntity(Long userid, String studentID, String firstName, String lastName, Department department, String email, String password, boolean isVerified) {
        this.userid = userid;
        this.studentID = studentID;
        this.firstName = firstName;
        this.lastName = lastName;
        this.department = department;
        this.email = email;
        this.password = password;
        this.isVerified = isVerified;
    }

    public UserEntity(String studentID, String firstName, String lastName, Department department, String email, String password, boolean isVerified) {
        this.studentID = studentID;
        this.firstName = firstName;
        this.lastName = lastName;
        this.department = department;
        this.email = email;
        this.password = password;
        this.isVerified = isVerified;
    }

    public Long getUserid() {
        return userid;
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

    public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isVerified() {
        return isVerified;
    }

    public void setVerified(boolean isVerified) {
        this.isVerified = isVerified;
    }
}
