package com.complaintbox.repository; import com.complaintbox.entity.*; import org.springframework.data.jpa.repository.*; import java.util.*;
public interface ComplaintHistoryRepository extends JpaRepository<ComplaintHistory,Long>{ List<ComplaintHistory> findByComplaintOrderByCreatedAtDesc(Complaint c); }
