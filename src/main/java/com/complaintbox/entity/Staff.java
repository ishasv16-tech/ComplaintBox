package com.complaintbox.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name="staff")
@Getter @Setter @NoArgsConstructor
public class Staff {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(nullable=false) private String name;
    @Column(nullable=false, unique=true) private String email;
    @Column(nullable=false) private String password;
    private String phone;
    private String specialty;
    @Enumerated(EnumType.STRING) @Column(nullable=false) private StaffRole role;
    private boolean active=true;
    public Staff(String name,String email,String password,String specialty,StaffRole role){this.name=name;this.email=email;this.password=password;this.specialty=specialty;this.role=role;}
}
