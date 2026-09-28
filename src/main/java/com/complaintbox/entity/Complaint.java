package com.complaintbox.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "complaints")
@Getter
@Setter
@NoArgsConstructor
public class Complaint {

 @Id
 @GeneratedValue(strategy = GenerationType.IDENTITY)
 private Long id;

 @Column(nullable = false, unique = true)
 private String complaintId;

 @ManyToOne(optional = false)
 private Resident resident;

 @ManyToOne(optional = false)
 private Category category;

 @ManyToOne
 private Staff assignedStaff;

 @Column(nullable = false)
 private String title;

 @Column(nullable = false, length = 4000)
 private String description;

 @Column(nullable = false)
 private String roomNumber;

 @Column(nullable = false)
 private String hostelBlock;

 @Enumerated(EnumType.STRING)
 @Column(nullable = false)
 private Priority priority = Priority.MEDIUM;

 @Enumerated(EnumType.STRING)
 @Column(nullable = false)
 private ComplaintStatus status = ComplaintStatus.OPEN;

 private String imageUrl;

 @Column(length = 3000)
 private String additionalInfo;

 @Column(length = 3000)
 private String wardenRemarks;

 @Column(nullable = false)
 private LocalDateTime createdAt;

 @Column(nullable = false)
 private LocalDateTime updatedAt;

 private LocalDateTime resolvedAt;

 private boolean overdue;

 @PrePersist
 void p() {
  createdAt = LocalDateTime.now();
  updatedAt = createdAt;
 }

 @PreUpdate
 void u() {
  updatedAt = LocalDateTime.now();
 }

 public enum Priority {
  LOW,
  MEDIUM,
  HIGH,
  URGENT
 }
}