package com.complaintbox.entity;
import jakarta.persistence.*; import lombok.*; import java.time.LocalDateTime;
@Entity @Table(name="complaint_history") @Getter @Setter @NoArgsConstructor
public class ComplaintHistory { @Id @GeneratedValue(strategy=GenerationType.IDENTITY) Long id; @ManyToOne(optional=false) Complaint complaint; Long actorUserId; String action; String fromStatus; String toStatus; @Column(length=3000) String note; LocalDateTime createdAt; @PrePersist void p(){createdAt=LocalDateTime.now();} }
