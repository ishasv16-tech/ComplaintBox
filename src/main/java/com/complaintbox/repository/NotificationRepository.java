package com.complaintbox.repository; import com.complaintbox.entity.*; import org.springframework.data.jpa.repository.*; import java.util.*;
public interface NotificationRepository extends JpaRepository<Notification,Long>{ List<Notification> findByResidentOrderByCreatedAtDesc(Resident r); List<Notification> findByStaffOrderByCreatedAtDesc(Staff s); }
