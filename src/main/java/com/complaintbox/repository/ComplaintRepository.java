package com.complaintbox.repository; import com.complaintbox.entity.*; import org.springframework.data.jpa.repository.*; import java.util.*;
public interface ComplaintRepository extends JpaRepository<Complaint,Long>{ List<Complaint> findByResidentOrderByCreatedAtDesc(Resident r); List<Complaint> findAllByOrderByCreatedAtDesc(); }
