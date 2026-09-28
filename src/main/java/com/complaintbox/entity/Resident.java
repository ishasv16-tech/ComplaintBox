package com.complaintbox.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name="residents")
@Getter @Setter @NoArgsConstructor
public class Resident {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(nullable=false) private String name;
    @Column(nullable=false, unique=true) private String email;
    @Column(nullable=false) private String password;
    @Column(unique=true) private String residentId;
    private String roomNumber;
    private String hostelBlock;
    private String phone;
    public Resident(String name,String email,String password,String residentId,String roomNumber,String hostelBlock){this.name=name;this.email=email;this.password=password;this.residentId=residentId;this.roomNumber=roomNumber;this.hostelBlock=hostelBlock;}
}
